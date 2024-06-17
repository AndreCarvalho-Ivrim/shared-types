import { StepType } from "../step.type"
import { AvailableHoursType } from "../workflow.config.type"
import { WorkflowType } from "../workflow.type"
import { getRecursiveValue } from "./recursive-datas"

interface CalcSlaParams{
  step?: StepType,
  flowData: any,
  workflow: WorkflowType
}
interface CalcSlaResponse{
  timeToExpireSla: number,
  timeToExpireOutherFields: (number | undefined)[] | undefined,
  closestToExpiration: number,
  unit: 'day' | 'hour'
}
export function calcDaysToExpireSla({ step, flowData, workflow }:CalcSlaParams) : (CalcSlaResponse | undefined) {
  try{
    if(step?.sla && step.sla.stay !== undefined && flowData.changed_step_at){
      const unit = step.sla.unit ?? 'day';

      if(unit === 'hour') return calcHoursToExpireSla({ step, flowData, workflow });
      
      const startDate = new Date(flowData.changed_step_at)
      startDate.setHours(0, 0, 0, 0)
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      const diffInMilliseconds = currentDate.getTime() - startDate.getTime()
      const oneHourInMilliseconds = 60 * 60 * 1000; // número de milissegundos em uma hora
      let timeToExpireSla = 0;
      
      const diffInDays = Math.round(diffInMilliseconds / (oneHourInMilliseconds * 24));
      timeToExpireSla = diffInDays - step.sla.stay;

      let timeToExpireOutherFields : (number | undefined)[] | undefined = []
      try{
        if(workflow?.config?.slas?.outher_fields && workflow.config.slas.outher_fields.length > 0){
          workflow.config.slas.outher_fields.forEach((outher) => {
            let tempDate = getRecursiveValue(outher.key, flowData)
            
            if(tempDate){
              try{
                const outherDate = new Date(tempDate);
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

      return {
        timeToExpireSla,
        timeToExpireOutherFields,
        closestToExpiration,
        unit
      }
    }
  }catch(e: any){
    console.error('[error-on-calc-sla]', {
      flow_data_id: flowData._id,
      step: step?.id,
      e
    }) 
  }
}
function calcHoursToExpireSla({ step, flowData, workflow }:CalcSlaParams) : (CalcSlaResponse | undefined) {
  try{
    if(!(step?.sla && step.sla.stay !== undefined && flowData.changed_step_at)) return;

    let availableHours = workflow.config?.slas?.available_hours;
    const startDate = handleAvailableDate({ date: flowData.changed_step_at, mode: 'start', availableHours })
    const endDate = !startDate ? undefined : handleAvailableDate({
      date: new Date(),
      mode: 'end',
      availableHours,
      startDate
    })
    const diffInHours = handleDiffInAvailableInterval({ startDate, endDate, availableHours });
    
    let timeToExpireSla = diffInHours - step.sla.stay;
    
    let timeToExpireOutherFields : (number | undefined)[] | undefined = []
    try{
      if(workflow?.config?.slas?.outher_fields && workflow.config.slas.outher_fields.length > 0){
        workflow.config.slas.outher_fields.forEach((outher) => {
          let tempDate = getRecursiveValue(outher.key, flowData)
          
          if(tempDate){
            try{
              const outherDate = handleAvailableDate({ date: tempDate, mode: 'start', availableHours });
              const endDate = !outherDate ? undefined : handleAvailableDate({
                date: new Date(),
                mode: 'end',
                availableHours,
                startDate: outherDate
              }) 

              if(!startDate || !endDate) timeToExpireOutherFields!.push(undefined);
              else{
                const tempDiffInHours = handleDiffInAvailableInterval({ startDate: outherDate, endDate, availableHours });
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
/** Envie o startDate, apenas quando o mode === 'end' */
function handleAvailableDate({ date, startDate, mode, availableHours }:{
  date: Date,
  startDate?: Date,
  mode: 'start' | 'end',
  availableHours?: AvailableHoursType
}) : Date | undefined {
  const parsedDate = new Date(date);

  const handleRercursiveAvailableDate = ({ parsedDate, mode, availableHours }:{
    parsedDate: Date,
    mode: 'start' | 'end',
    availableHours?: AvailableHoursType
  }) : Date | undefined => {
    if(!parsedDate) return undefined;
    const hasAvailableHours = availableHours && Object.keys(availableHours).length > 0;

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
          return handleRercursiveAvailableDate({ parsedDate, mode, availableHours });
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
        return handleRercursiveAvailableDate({ parsedDate, mode, availableHours })
      } 
    }
    else if(mode === 'end'){
      if(!startDate || startDate.getTime() > parsedDate.getTime()) return undefined;
      if(currAvailableHours){
        let hourInMinutes = (parsedDate.getHours() * 60) + parsedDate.getMinutes();
        let avStartInMinutes = convertHourStringInMinutes(currAvailableHours[0]);
        let avEndInMinutes = convertHourStringInMinutes(currAvailableHours[1]);

        if(hourInMinutes < avStartInMinutes){
          parsedDate.setHours(23,59,59,59);
          parsedDate.setDate(parsedDate.getDate() - 1)

          if(startDate.getTime() > parsedDate.getTime()) return undefined;
          return handleRercursiveAvailableDate({ parsedDate, mode, availableHours });
        }
        if(hourInMinutes > avEndInMinutes){
          let diff = hourInMinutes - avEndInMinutes;
          parsedDate.setMinutes(parsedDate.getMinutes() - diff);

          if(startDate.getTime() > parsedDate.getTime()) return undefined;
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

        if(startDate.getTime() > parsedDate.getTime()) return undefined;
        return handleRercursiveAvailableDate({ parsedDate, mode, availableHours })
      }
    }
  
    return undefined;
  }

  return handleRercursiveAvailableDate({ parsedDate, mode, availableHours });
}
function handleDiffInAvailableInterval({ startDate, endDate, availableHours = {} }:{
  startDate?: Date,
  endDate?: Date,
  availableHours?: AvailableHoursType
}) : number {
  const oneHourInMilliseconds = 60 * 60 * 1000;
  let diffInMilliseconds = (!startDate || !endDate) ? 0 : (
    endDate.getTime() - startDate.getTime()
  );

  console.log({ diffInMilliseconds })
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
      
      Array.from({ length: diffInDays }).forEach((_,i) => {
        startWeekday++;
        if(startWeekday >= 7) startWeekday = 0;
  
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
  
      diffInMilliseconds-= accumulatedInvalidMilliseconds;
    }
  }

  return Math.round(diffInMilliseconds / oneHourInMilliseconds);
}