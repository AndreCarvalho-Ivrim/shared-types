import moment from 'moment'
import { StepType } from "../step.type"
import { AvailableHoursType } from "../workflow.config.type"
import { WorkflowType } from "../workflow.type"
import { checkStringConditional, getShortcodes } from './check-string-conditional'
import { getRecursiveValue } from "./recursive-datas"

export interface ExceptionDays{
  _id?: string,
  /** yyyy-mm-dd */
  date: string,
}
interface CalcSlaParams{
  step?: StepType,
  flowData: any,
  workflow: WorkflowType,
  exceptionDays?: ExceptionDays[]
}
interface CalcSlaResponse{
  timeToExpireSla: number,
  timeToExpireOutherFields: (number | undefined)[] | undefined,
  closestToExpiration: number,
  unit: 'day' | 'hour'
}

export function getDataBySlaShortCode(key: string, data: Record<string, any>) {
  const shortcodes: Record<string, any> = {
    '@id': data._id,
    '@user_id': data.user_id,
    '@created_at': data.created_at,
    '@updated_at': data.updated_at,
    '@step_id': data.current_step_id,
    '@owner_ids': data.owners?.user_ids ?? []
  }
  return shortcodes[key];
}

export function calcDaysToExpireSla({ step, flowData, workflow, exceptionDays }:CalcSlaParams) : (CalcSlaResponse | undefined) {
  try{
    let timeToExpireSla: number = 0;
    let unit: 'day' | 'hour' = 'day';
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    if(step?.sla && step.sla.stay !== undefined && flowData.changed_step_at){
      unit = step.sla.unit ?? 'day';

      if(unit === 'hour') return calcHoursToExpireSla({ step, flowData, workflow, exceptionDays });
      
      const startDate = new Date(flowData.changed_step_at)
      startDate.setHours(0, 0, 0, 0)

      const diffInMilliseconds = currentDate.getTime() - startDate.getTime()
      const oneHourInMilliseconds = 60 * 60 * 1000; // número de milissegundos em uma hora
      
      const diffInDays = Math.round(diffInMilliseconds / (oneHourInMilliseconds * 24));
      timeToExpireSla = diffInDays - step.sla.stay;
    }
    let timeToExpireOutherFields : (number | undefined)[] | undefined = []
    try{
      if(workflow?.config?.slas?.outher_fields && workflow.config.slas.outher_fields.length > 0){
        workflow.config.slas.outher_fields.forEach((outher) => {
          if (outher.validity) {
            if (
              outher.validity.available_steps && 
              outher.validity.available_steps.length > 0 &&
              !outher.validity.available_steps.includes(flowData.current_step_id)
            ) return;
            if (outher.validity.restriction && checkStringConditional(outher.validity.restriction, flowData)) return;
            if (outher.validity.condition && !checkStringConditional(outher.validity.condition, flowData)) return;
          }

          let outherKey = outher.key;
          let tempDate = null;
          if (outherKey.includes('@')) tempDate = getDataBySlaShortCode(outherKey, flowData);
          else tempDate = getRecursiveValue(outherKey, flowData);
          
          if(tempDate){
            try{
              let outherDate = new Date(tempDate);
              if (outher.mode === 'stay' && outher.stay) 
                outherDate = moment(outherDate).add(outher.stay, 'days').toDate();
              outherDate.setHours(0, 0, 0, 0);
              
              const tempDiffInMilliseconds = outherDate.getTime() - currentDate.getTime();
              const tempOneHourInMilliseconds = 60 * 60 * 1000; // número de milissegundos em uma hora
              
              const tempDiffInDays = Math.round(tempDiffInMilliseconds / (tempOneHourInMilliseconds * 24));
              timeToExpireOutherFields!.push((tempDiffInDays + 1) * -1)
            }catch(e){ timeToExpireOutherFields!.push(undefined) }
          }else timeToExpireOutherFields!.push(undefined)
        })
      }
      else timeToExpireOutherFields = undefined
    }catch(e: any){
      console.error('[error-on-calc-outher-slas]', {
        e, outher_slas: workflow?.config?.slas?.outher_fields,
      })
      timeToExpireOutherFields = undefined
    }

    const closestToExpiration = !timeToExpireOutherFields || timeToExpireOutherFields.length === 0 ? timeToExpireSla : (timeToExpireOutherFields.filter(
      (d) => d !== undefined
    ) as number[]).reduce((acc, curr) => {
      return Math.max(acc, curr);
    }, timeToExpireSla);
    console.log('🚀 ~ calcDaysToExpireSla ~ closestToExpiration:', closestToExpiration, !timeToExpireOutherFields || timeToExpireOutherFields.length === 0)

    return {
      timeToExpireSla,
      timeToExpireOutherFields,
      closestToExpiration,
      unit
    };
  }catch(e: any){
    console.error('[error-on-calc-sla]', {
      flow_data_id: flowData._id,
      step: step?.id,
      e
    }) 
  }
}
function calcHoursToExpireSla({ step, flowData, workflow, exceptionDays }:CalcSlaParams) : (CalcSlaResponse | undefined) {
  try{
    if(!(step?.sla && step.sla.stay !== undefined && flowData.changed_step_at)) return;

    let availableHours = workflow.config?.slas?.available_hours;

    const startDate = handleAvailableDate({ date: flowData.changed_step_at, mode: 'start', availableHours, exceptionDays })
    const endDate = !startDate ? undefined : handleAvailableDate({
      date: new Date(),
      mode: 'end',
      availableHours,
      exceptionDays,
      startDate,
    })
    const diffInHours = handleDiffInAvailableInterval({ startDate, endDate, availableHours, exceptionDays });
    
    let timeToExpireSla = diffInHours - step.sla.stay;
    
    let timeToExpireOutherFields : (number | undefined)[] | undefined = []
    try{
      if(workflow?.config?.slas?.outher_fields && workflow.config.slas.outher_fields.length > 0){
        workflow.config.slas.outher_fields.forEach((outher) => {
          let tempDate = getRecursiveValue(outher.key, flowData)
          
          if(tempDate){
            try{
              const outherDate = handleAvailableDate({ date: tempDate, mode: 'start', availableHours, exceptionDays });
              const endDate = !outherDate ? undefined : handleAvailableDate({
                date: new Date(),
                mode: 'end',
                availableHours,
                exceptionDays,
                startDate: outherDate
              }) 

              if(!startDate || !endDate) timeToExpireOutherFields!.push(undefined);
              else{
                const tempDiffInHours = handleDiffInAvailableInterval({ startDate: outherDate, endDate, availableHours, exceptionDays });
                timeToExpireOutherFields!.push((tempDiffInHours) * -1);
              }
            }catch(e){ timeToExpireOutherFields!.push(undefined) }
          }else timeToExpireOutherFields!.push(undefined)
        })
      }
      else timeToExpireOutherFields = undefined
    }catch(e: any){
      console.error('[error-on-calc-outher-slas]', {
        e, outher_slas: workflow?.config?.slas?.outher_fields,
      })
      timeToExpireOutherFields = undefined
    }
    
    const closestToExpiration = !timeToExpireOutherFields || timeToExpireOutherFields.length === 0 ? timeToExpireSla : (timeToExpireOutherFields.filter(
      (d) => d !== undefined
    ) as number[]).reduce((acc, curr) => {
      return Math.max(acc, curr);
    }, timeToExpireSla);

    return {
      timeToExpireSla,
      timeToExpireOutherFields,
      closestToExpiration,
      unit: 'hour'
    }
  }catch(e: any){
    console.error('[error-on-calc-sla]', {
      flow_data_id: flowData._id,
      step: step?.id,
      e
    }) 
  }
}
/** hourStr no padrão 00:00 */
const convertHourStringInMinutes = (hourStr: string) : number => {
  const [hours, minutes] = hourStr.split(':');
  return (Number(hours) * 60) + Number(minutes);
}
/** Converter objeto Date para string no formato YYYY-mm-dd */
export const dateToStrYmd = (date: Date): string => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');
/** Envie o startDate, apenas quando o mode === 'end' */
export function handleAvailableDate({ date, startDate, mode, availableHours, exceptionDays }:{
  date: Date,
  startDate?: Date,
  mode: 'start' | 'end',
  availableHours?: AvailableHoursType,
  exceptionDays?: ExceptionDays[]
}) : Date | undefined {
  const parsedDate = new Date(date);

  const hasExceptionDays = exceptionDays && exceptionDays.length > 0;
  const hasAvailableHours = availableHours && Object.keys(availableHours).length > 0;

  const handleRercursiveAvailableDate = (parsedDate: Date) : Date | undefined => {
    if(!parsedDate) return undefined;  

    if(mode === 'end' && (
      !startDate || startDate.getTime() > parsedDate.getTime()
    )) return undefined;

    if(hasExceptionDays){
      let targetDate = dateToStrYmd(parsedDate);
      if(exceptionDays.some(({ date }) => date === targetDate)){
        if(mode === 'start'){
          parsedDate.setHours(0,0,0,0);
          parsedDate.setDate(parsedDate.getDate() + 1);
          return handleRercursiveAvailableDate(parsedDate);
        }
        else if(mode === 'end'){
          parsedDate.setHours(23,59,59,59);
          parsedDate.setDate(parsedDate.getDate() - 1)

          if(startDate!.getTime() > parsedDate.getTime()) return undefined;
          return handleRercursiveAvailableDate(parsedDate);
        }   
      }
    }

    if(!hasAvailableHours) return parsedDate;
    
    let currAvailableHours = availableHours[parsedDate.getDay() as keyof AvailableHoursType];

    if(mode === 'start'){
      if(currAvailableHours){
        let hourInMinutes = (parsedDate.getHours() * 60) + parsedDate.getMinutes();
        let avStartInMinutes = convertHourStringInMinutes(currAvailableHours[0]);
        let avEndInMinutes = convertHourStringInMinutes(currAvailableHours[1]);

        if(hourInMinutes < avStartInMinutes){
          let diff = avStartInMinutes - hourInMinutes;
          parsedDate.setMinutes(parsedDate.getMinutes() + diff);

          return parsedDate;
        }
        if(hourInMinutes > avEndInMinutes){
          parsedDate.setHours(0,0,0,0);
          parsedDate.setDate(parsedDate.getDate() + 1);
          return handleRercursiveAvailableDate(parsedDate);
        }

        return parsedDate;
      }
      else{
        let nextDays = 1;
        let currWeekday = parsedDate.getDay();
        if((currWeekday + nextDays) > 6) currWeekday = -1;

        while(!availableHours[(currWeekday + nextDays) as keyof AvailableHoursType]){
          nextDays++;
          if(currWeekday + nextDays > 6) currWeekday = -1;
          if(nextDays >= 7) break;
        }

        if(nextDays >= 7) return undefined;
        parsedDate.setHours(0,0,0,0);
        parsedDate.setDate(parsedDate.getDate() + nextDays);
        return handleRercursiveAvailableDate(parsedDate)
      } 
    }
    else if(mode === 'end'){
      if(currAvailableHours){
        let hourInMinutes = (parsedDate.getHours() * 60) + parsedDate.getMinutes();
        let avStartInMinutes = convertHourStringInMinutes(currAvailableHours[0]);
        let avEndInMinutes = convertHourStringInMinutes(currAvailableHours[1]);

        if(hourInMinutes < avStartInMinutes){
          parsedDate.setHours(23,59,59,59);
          parsedDate.setDate(parsedDate.getDate() - 1)

          if(startDate!.getTime() > parsedDate.getTime()) return undefined;
          return handleRercursiveAvailableDate(parsedDate);
        }
        if(hourInMinutes > avEndInMinutes){
          let diff = hourInMinutes - avEndInMinutes;
          parsedDate.setMinutes(parsedDate.getMinutes() - diff);

          if(startDate!.getTime() > parsedDate.getTime()) return undefined;
          return parsedDate;
        }

        return parsedDate;
      }
      else{
        let prevDays = 1;
        let currWeekday = parsedDate.getDay();
        if((currWeekday - prevDays) < 0) currWeekday = 7;

        while(!availableHours[(currWeekday - prevDays) as keyof AvailableHoursType]){
          prevDays++;
          if(currWeekday - prevDays < 0) currWeekday = 7;
          if(prevDays >= 7) break;
        }
        
        if(prevDays >= 7) return undefined;
        parsedDate.setHours(23,59,59,59);
        parsedDate.setDate(parsedDate.getDate() - prevDays);

        if(startDate!.getTime() > parsedDate.getTime()) return undefined;
        return handleRercursiveAvailableDate(parsedDate)
      }
    }
  
    return undefined;
  }

  return handleRercursiveAvailableDate(parsedDate);
}
function handleDiffInAvailableInterval({ startDate, endDate, availableHours = {}, exceptionDays }:{
  startDate?: Date,
  endDate?: Date,
  availableHours?: AvailableHoursType,
  exceptionDays?: ExceptionDays[]
}) : number {
  const oneHourInMilliseconds = 60 * 60 * 1000;
  let diffInMilliseconds = (!startDate || !endDate) ? 0 : (
    endDate.getTime() - startDate.getTime()
  );

  if(diffInMilliseconds > 0 && startDate && endDate && startDate.toDateString() !== endDate.toDateString()){
    let accumulatedInvalidMilliseconds = 0;

    const hasAvailableHours = availableHours && Object.keys(availableHours).length > 0;
    if(hasAvailableHours){
      const diffInDays = Math.round(diffInMilliseconds / (oneHourInMilliseconds * 24))
      let startWeekday : keyof AvailableHoursType = startDate.getDay() as keyof AvailableHoursType;
  
      let dayInMilliseconds = 24 * 60 * 60 * 1000;
      if(!availableHours[startWeekday]) accumulatedInvalidMilliseconds+= dayInMilliseconds;
      else accumulatedInvalidMilliseconds+= dayInMilliseconds - (
        convertHourStringInMinutes(availableHours[startWeekday]![1]) * 60 * 1000
      );
      
      if(diffInDays >= 1){
        let currentDate = new Date(startDate);
        const hasExceptionDays = exceptionDays && exceptionDays.length > 0;

        Array.from({ length: diffInDays }).forEach((_,i) => {
          startWeekday++;
          if(startWeekday >= 7) startWeekday = 0;
    
          if(hasExceptionDays){
            currentDate.setDate(currentDate.getDate() + 1);
            let targetDate = dateToStrYmd(currentDate);
            if(exceptionDays.some(({ date }) => date === targetDate)){
              accumulatedInvalidMilliseconds+= dayInMilliseconds
              return;
            }
          }
          
          if(!availableHours[startWeekday as keyof AvailableHoursType]) accumulatedInvalidMilliseconds+= dayInMilliseconds;
          else{
            accumulatedInvalidMilliseconds+= (
              convertHourStringInMinutes(availableHours[startWeekday as keyof AvailableHoursType]![0]) * 60 * 1000
            );
            if(i < (diffInDays - 1)) accumulatedInvalidMilliseconds+= dayInMilliseconds - (
              convertHourStringInMinutes(
                availableHours[startWeekday as keyof AvailableHoursType]![1]
              ) * 60 * 1000
            );
          }
        })
      }
  
      diffInMilliseconds-= accumulatedInvalidMilliseconds;
    }
  }

  return Math.round(diffInMilliseconds / oneHourInMilliseconds);
}