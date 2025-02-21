import { getShortcodes } from "./check-string-conditional"
import { getRecursiveValue, replaceAll } from "./recursive-datas"

export function handleCustomPermissions({ newFlowData, flowData, permissions }:{
  permissions: string[],
  flowData: any,
  newFlowData?: any,
}){
  if(!permissions) return[]
  
  return permissions.map((perm) => {
    if(perm.includes('@custom:')){
      let parsed = perm.replace('@custom:','')

      const shortcodes = getShortcodes(parsed);
      shortcodes.forEach((shortcode) => {
        let valueToReplace : any | undefined = undefined 
        
        if(newFlowData) valueToReplace = getRecursiveValue(shortcode, newFlowData)
        if(!valueToReplace && valueToReplace !== 0) valueToReplace = getRecursiveValue(shortcode, flowData)
        
        parsed = replaceAll(parsed, `@[${shortcode}]`, valueToReplace)
      })

      return parsed
    }

    return perm
  })
}
export function handleCustomActionsPermission({ actions, flowData, newFlowData }: {
  flowData: any,
  newFlowData?: any,
  actions: string[]
}) : string[]{
  if(!actions) return []

  return actions.reduce((acc, curr) => {
    if(!curr) return acc;

    if(curr.includes('@custom-actions:')){
      let parsed = curr.replace('@custom-actions:','')

      const shortcodes = getShortcodes(parsed);
      shortcodes.forEach((shortcode) => {
        let valueToReplace : any | undefined = undefined 
        
        if(newFlowData) valueToReplace = getRecursiveValue(shortcode, newFlowData)
        if(!valueToReplace && valueToReplace !== 0) valueToReplace = getRecursiveValue(shortcode, flowData)
        
        if(typeof valueToReplace !== 'string'){
          if(!Array.isArray(valueToReplace)) valueToReplace = ''
          else{
            valueToReplace = valueToReplace.filter((v: any) => typeof v === 'string')
            if(valueToReplace.length === 0) valueToReplace = ''
            else valueToReplace = valueToReplace.join(',')
          }
        }
        
        parsed = replaceAll(parsed, `@[${shortcode}]`, valueToReplace)
      })

      curr = parsed
    }
    
    if(!curr) return acc;
    return [
      ...acc,
      ...curr.split(',')
    ];
  }, [] as string[])
}
export const convertFormattedWhatsappToClean = (whatsapp: string) => {
  if(typeof whatsapp !== 'string') return '';
  const lean = whatsapp.replace(/\D/g,'')
  if(lean.length === 10 || lean.length === 11) return `55${lean}`;
  return lean;
}