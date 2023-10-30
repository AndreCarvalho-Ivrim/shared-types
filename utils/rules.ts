import { getShortcodes } from "./check-string-conditional"
import { getRecursiveValue, replaceAll } from "./recursive-datas"

export function handleCustomPermissions({ flowData, permissions }:{
  permissions: string[],
  flowData: any
}){
  if(!permissions) return[]
  
  return permissions.map((perm) => {
    if(perm.includes('@custom:')){
      let parsed = perm.replace('@custom','')

      const shortcodes = getShortcodes(parsed);
      shortcodes.forEach((shortcode) => {
        const valueToReplace = getRecursiveValue(shortcode, flowData)
        parsed = replaceAll(parsed, `@[${shortcode}]`, valueToReplace)
      })

      return parsed
    }

    return perm
  })
}