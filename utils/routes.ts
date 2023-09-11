import { getRecursiveValue } from "./recursive-datas"

export const isacRoutes = {
  home:       () => '/',
  template:   () => '/modelos',
  workflow: {
    create:   (module_name: string) => `/fluxo/${module_name}`,
    test:     (module_name: string) => `/fluxo/${module_name}/teste-de-execucao`,
    exec:     (module_name: string, view_mode?: string) => `/modulo/${module_name}${view_mode ? `/${view_mode}`:``}`,
    entity:   (module_name: string, entity: string) => `/entidade/${module_name}/${entity}`,
    calendar: (module_name: string) => `/calendario-do-fluxo/${module_name}`
  },
  permission: (module_name: string) => `/permissoes-de-usuarios/${module_name}`,
  icon:       () => '/icones',
  login:      () => '/login',
  menu:       () => '/menu',
  defaults:   () => '/defaults'
}
export const hubRoutes = {
  auth: {
    login:  () => '/login',
    logout: () => '/logout',
  },
  old_cap: {
    alert:  () => '/alertas',
    home:   () =>  '/compras-e-contas-a-pagar',
    docs:   (id: string) =>  `/documentos-para-pagamento/${id}`,
    models: () => '/modelos-de-documentos',
  },
  reconciliation: {
    home:    () => '/conciliacao',
    manage:  () => '/conciliacao/gerenciamento',
    history: () => '/conciliacao/conciliados',
  },
  admin_panel: {
    client:     () => '/painel-adm/empresa',
    home:       () => '/painel-adm',
    projects:   () => '/painel-adm/projetos',
    dashboards: () => '/painel-adm/dashboards',
  },
  dashboard: {
    home: () => '/co-pilot-dashboard',
    show: (slug: string) => `/co-pilot-dashboard/${slug}`,
  },
  gallery: {
    home: () => '/meus-docs',
    show: (id: string) => `/meus-docs/${id}`,
  }
}

export const handleRegexUrl = (url: string) => {
  const getUrl = (url: string, prefix: string, routes: Record<string, any>) => {
    let withoutPrefix = url.replace(prefix, '')
    let route_name = withoutPrefix.includes('(') ? withoutPrefix.split('(')[0] : withoutPrefix
    let params = withoutPrefix.includes('(') ? withoutPrefix.split('(')[1].replace(')','').split(',') : []

    const route = getRecursiveValue(route_name, { data: routes })

    return route(...params)
  }
  if(url.substring(0,4) === 'http') return url
  if(url.includes('@hub:'))   return `${getDomain('hub', true)}${getUrl(url, '@hub:', hubRoutes)}`
  if(url.includes('@isac:'))  return `${getDomain('isac', true)}${getUrl(url, '@isac:', isacRoutes)}`

  console.error('[invalid-format:handle-regex-url]', { url })
  throw new Error('URL de redirecionamento fora do padrão esperado')
}
export const getDomain = (application: 'hub' | 'isac', removeLastSlash = false) => {
  let urls = { hub: '', isac: '' }
  try{
    // @ts-ignore
    const WORKFLOW_MODULE = process.env.REACT_APP_WORKFLOW_MODULAR;
    urls.isac = WORKFLOW_MODULE!;
  }catch(e){ }
  try{
    // @ts-ignore
    const PORTAL = import.meta.env.VITE_PORTAL_URL;
    urls.hub = PORTAL!;
  }catch(e){ }
  
  let url = urls[application]
  if(removeLastSlash && url.substr(-1) === '/') url = url.substr(0, url.length - 1)

  return url
}