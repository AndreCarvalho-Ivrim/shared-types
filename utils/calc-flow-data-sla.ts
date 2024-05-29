import { StepType } from "../step.type"
import { WorkflowType } from "../workflow.type"
import { getRecursiveValue } from "./recursive-datas"

export function calcDaysToExpireSla({ step, flowData, workflow }:{
  step?: StepType,
  flowData: any,
  workflow: WorkflowType
}) : ({
  timeToExpireSla: number,
  timeToExpireOutherFields: (number | undefined)[] | undefined,
  closestToExpiration: number,
  unit: 'day' | 'hour'
} | undefined) {
  try{
    if(step?.sla && step.sla.stay !== undefined && flowData.changed_step_at){
      const unit = step.sla.unit ?? 'day';

      const startDate = new Date(flowData.changed_step_at)
      if(unit === 'day') startDate.setHours(0, 0, 0, 0)
      const currentDate = new Date()
      if(unit === 'day') currentDate.setHours(0, 0, 0, 0)

      const diffInMilliseconds = currentDate.getTime() - startDate.getTime()
      const oneHourInMilliseconds = 60 * 60 * 1000; // número de milissegundos em uma hora
      let timeToExpireSla = 0;
      if(unit === 'day'){
        const diffInDays = Math.round(diffInMilliseconds / (oneHourInMilliseconds * 24));
        timeToExpireSla = diffInDays - step.sla.stay;
      }else if(unit === 'hour'){
        const diffInHours = Math.round(diffInMilliseconds / oneHourInMilliseconds);
        timeToExpireSla = diffInHours - step.sla.stay;
      }

      let timeToExpireOutherFields : (number | undefined)[] | undefined = []
      try{
        if(workflow?.config?.slas?.outher_fields && workflow.config.slas.outher_fields.length > 0){
          workflow.config.slas.outher_fields.forEach((outher) => {
            let tempDate = getRecursiveValue(outher.key, flowData)
            
            if(tempDate){
              try{
                const outherDate = new Date(tempDate);
                if(unit === 'day') outherDate.setHours(0, 0, 0, 0);

                const tempDiffInMilliseconds = outherDate.getTime() - currentDate.getTime();
                const tempOneHourInMilliseconds = 60 * 60 * 1000; // número de milissegundos em uma hora
                if(unit === 'day'){
                  const tempDiffInDays = Math.round(tempDiffInMilliseconds / (tempOneHourInMilliseconds * 24));
                  timeToExpireOutherFields!.push((tempDiffInDays + 1) * -1)
                }else{
                  const tempDiffInHours = Math.round(tempDiffInMilliseconds / tempOneHourInMilliseconds);
                  timeToExpireOutherFields!.push((tempDiffInHours) * -1)
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