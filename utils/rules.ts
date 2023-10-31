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