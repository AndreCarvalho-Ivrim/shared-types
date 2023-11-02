import { getRecursiveValue } from "./recursive-datas"

export const isacRoutes = {
  home:       () => '/',
  template:   () => '/modelos',
  workflow: {
    home:     () => '/fluxos',
    create:   (module_name: string) => `/fluxo/${module_name}`,
    test:     (module_name: string) => `/fluxo/${module_name}/teste-de-execucao`,
    exec:     (module_name: string, view_mode?: string) => `/modulo/${module_name}${view_mode ? `/${view_mode}`:``}`,
    entity:   (module_name: string, entity: string) => `/entidade/${module_name}/${entity}`,
    calendar: (module_name: string) => `/calendario-do-fluxo/${module_name}`,
    sla_panel:(module_name: string) => `/painel-sla/${module_name}`
  },
  permission: (module_name: string) => `/permissoes-de-usuarios/${module_name}`,
  icon:       () => '/icones',
  login:      () => '/login',
  menu:       () => '/menu',
  admin_hub: {
    workflows: () => '/painel-hub/workflows',
  }
}
export const hubRoutes = {
  auth: {
    login:  () => '/login',
    logout: () => '/logout',
  },
  profile: {
    home: () => '/perfil'
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
    users:       () => '/painel-adm',
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
  },
  notification: {
    all: () => '/notificacoes',
    preference: () => '/notificacoes/preferencias',
    create: () => '/notificacoes/criar'
  }
}

/**
 * Você pode enviar urls comuns, ou menções a rotas das aplicações hub e isac \
 * \@hub:\<route_name\> \
 * \@isac:\<route_name\>
 * 
 * Exemplos:
 * - \@hub:profile.home
 * - \@isac:workflow.exec(245243131-214142-1241412)
 *
 * Passando o token como segundo parametro ele será adicionado automáticamente \
 * caso seja uma transição de aplicação.
 */
export const handleRegexUrl = (url: string, token?: string) => {
  const getUrl = (url: string, prefix: string, routes: Record<string, any>) => {
    let withoutPrefix = url.replace(prefix, '')
    let route_name = withoutPrefix.includes('(') ? withoutPrefix.split('(')[0] : withoutPrefix
    let params = withoutPrefix.includes('(') ? withoutPrefix.split('(')[1].replace(')','').split(',') : []

    const route = getRecursiveValue(route_name, { data: routes })

    return route(...params)
  }
  if(url.substring(0,4) === 'http') return url
  
  let handledUrl : string | undefined = undefined
  if(url.includes('@hub:'))  handledUrl = `${getDomain('hub', true)}${getUrl(url, '@hub:', hubRoutes)}`
  if(url.includes('@isac:')) handledUrl = `${getDomain('isac', true)}${getUrl(url, '@isac:', isacRoutes)}`
  if(handledUrl){
    if(token && handledUrl.substring(0,4) === 'http' && !handledUrl.includes('?token=')){
      if(handledUrl.includes('?')) return `${handledUrl}&token=${token}`
      return `${handledUrl}?token=${token}`
    }

    return handledUrl;
  }

  return url
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
  
  let url = urls[application] ?? '';
  if(removeLastSlash && url.substr(-1) === '/') url = url.substr(0, url.length - 1)

  return url
}