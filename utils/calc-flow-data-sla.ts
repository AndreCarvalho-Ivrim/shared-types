import { StepType } from "../step.type"
import { WorkflowType } from "../workflow.type"
import { getRecursiveValue } from "./recursive-datas"

export function calcDaysToExpireSla({ step, flowData, workflow }:{
  step?: StepType,
  flowData: any,
  workflow: WorkflowType
}) : ({
  daysToExpireSla: number,
  daysToExpireOutherFields: (number | undefined)[] | undefined,
  closestToExpiration: number
} | undefined) {
  try{
    if(step?.sla && step.sla.stay !== undefined && flowData.changed_step_at){
      const startDate = new Date(flowData.changed_step_at)
      startDate.setHours(0, 0, 0, 0)
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      const diffInMilliseconds = currentDate.getTime() - startDate.getTime()
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // número de milissegundos em um dia
      const diffInDays = Math.round(diffInMilliseconds / oneDayInMilliseconds);

      const daysToExpireSla = diffInDays - step.sla.stay

      let daysToExpireOutherFields : (number | undefined)[] | undefined = []
      try{
        if(workflow?.config?.slas?.outher_fields && workflow.config.slas.outher_fields.length > 0){
          workflow.config.slas.outher_fields.forEach((outher) => {
            let tempDate = getRecursiveValue(outher.key, flowData)
            
            if(tempDate){
              try{
                const outherDate = new Date(tempDate)
                outherDate.setHours(0, 0, 0, 0)

                const tempDiffInMilliseconds = outherDate.getTime() - currentDate.getTime();
                const tempOneDayInMilliseconds = 24 * 60 * 60 * 1000; // número de milissegundos em um dia
                const tempDiffInDays = Math.round(tempDiffInMilliseconds / tempOneDayInMilliseconds);
                
                daysToExpireOutherFields!.push((tempDiffInDays + 1) * -1)
              }catch(e){ daysToExpireOutherFields!.push(undefined) }
            }else daysToExpireOutherFields!.push(undefined)
          })
        }
        else daysToExpireOutherFields = undefined
      }catch(e: any){
        console.error('[error-on-calc-outher-slas]', {
          e, outher_slas: workflow?.config?.slas?.outher_fields,
        })
        daysToExpireOutherFields = undefined
      }

      const closestToExpiration = !daysToExpireOutherFields || daysToExpireOutherFields.length === 0 ? daysToExpireSla : (daysToExpireOutherFields.filter(
        (d) => d !== undefined
      ) as number[]).reduce((acc, curr) => {
        return Math.max(acc, curr);
      }, daysToExpireSla);

      return {
        daysToExpireSla,
        daysToExpireOutherFields,
        closestToExpiration
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