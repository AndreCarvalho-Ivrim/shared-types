import { getRecursiveValue } from "./recursive-datas"

export const isacRoutes = {
  home: () => '/',
  template: () => '/modelos',
  chatbot: {
    home: () => '/chatbot',
    manage: (module_name: string) => `/chatbot/${module_name}`,
    manage_contact: (module_name: string) => `/chatbot/${module_name}`,
  },
  workflow: {
    home: () => '/fluxos',
    create: (module_name: string) => `/fluxo/${module_name}`,
    test: (module_name: string) => `/fluxo/${module_name}/teste-de-execucao`,
    exec: (module_name: string, view_mode?: string) => `/modulo/${module_name}${view_mode ? `/${view_mode}` : ``}`,
    entity: (module_name: string, entity: string) => `/entidade/${module_name}/${entity}`,
    calendar: (module_name: string) => `/calendario-do-fluxo/${module_name}`,
    sla_panel: (module_name: string) => `/painel-sla/${module_name}`,
    open_dialog: (module_name: string) => `/dialogo-aberto/${module_name}`,
    logs: {
      main: (module_name: string) => `/logs/${module_name}`,
      log_type: (module_name: string, log_type: string) => `/logs/${module_name}/${log_type}`,
    },
    exception: (module_name: string, exception: string) => `/exception/${module_name}/${exception}`,
    flowchat: (module_name: string, flow_data_id: string, chat_id: string) => `/flowchat/${module_name}/${flow_data_id}/${chat_id}`,
  },
  report: {
    home: () => '/report'
  },
  permission: (module_name: string) => `/permissoes-de-usuarios/${module_name}`,
  icon: () => '/icones',
  login: () => '/login',
  menu: () => '/menu',
  admin_hub: {
    workflows: () => '/painel-hub/workflows',
  },
  public: {
    workflow: (flow_id: string, variation: string, params?: Record<string, string>) => `/public/fluxo/${flow_id}/${variation}${
      params ? `?${Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')}`:''
    }`,
    flowchat: (flow_id: string, flow_data_id: string, owner_id: string, email_guest: string, message_id: string) => `/public/flowchat/${flow_id}/${flow_data_id}/${owner_id}/${email_guest}/${message_id}`,
  }
}
export const hubRoutes = {
  auth: {
    login: () => '/login',
    showCodeToken: (email:string) => `/esqueci-senha/${email}`,
    logout: () => '/logout',
  },
  session: {
    home: () => '/session'
  },
  profile: {
    home: () => '/perfil'
  },
  old_cap: {
    alert: () => '/alertas',
    home: () => '/compras-e-contas-a-pagar',
    docs: (id: string) => `/documentos-para-pagamento/${id}`,
    models: () => '/modelos-de-documentos',
  },
  reconciliation: {
    home: () => '/conciliacao',
    manage: () => '/conciliacao/gerenciamento',
    history: () => '/conciliacao/conciliados',
  },
  admin_panel: {
    client: () => '/painel-adm/empresa',
    companies: () => '/painel-adm/empresas',
    users_by_client: () => '/painel-adm/usuarios-por-empresa',
    users: () => '/painel-adm',
    projects: () => '/painel-adm/projetos',
    dashboards: () => '/painel-adm/dashboards',
    integrations: {
      whatsapp: () => '/painel-adm/integracao-whatsapp',
    },
  },
  icon: () => '/icones',
  dashboard: {
    home: () => '/co-pilot-dashboard',
    show: (slug: string) => `/co-pilot-dashboard/${slug}`,
  },
  gallery: {
    home: () => '/meus-docs',
    show: (id: string) => `/meus-docs/${id}`,
  },
  closing_folder: {
    home: (paths?: string[]) => `/fechamento-financeiro/${(paths ?? []).join('/')}`,
  },
  notification: {
    all: () => '/notificacoes',
    preference: () => '/notificacoes/preferencias',
    create: () => '/notificacoes/criar'
  },
  support: {
    home: () => '/suporte',
    details: (_id: string) => `/suport/${_id}`
  }
}
export const isacBackRoutes = {
  public_route: (flow_id: string, variation: string) => `/flow-data/datas/${flow_id}/${variation}`
}

export type AvailableRegexUrls =
  '@isac:home' |
  '@isac:template' |
  '@isac:workflow.home' |
  '@isac:workflow.create(module_name)' |
  '@isac:workflow.test(module_name)' |
  '@isac:workflow.exec(module_name,view_mode?)' |
  '@isac:workflow.entity(module_name,entity)' |
  '@isac:workflow.calendar(module_name)' |
  '@isac:workflow.sla_panel(module_name)' |
  '@isac:workflow.open_dialog(module_name)' |
  '@isac:report.home' |
  '@isac:permission(module_name)' |
  '@isac:icon' |
  '@isac:login' |
  '@isac:menu' |
  '@isac:admin_hub.workflows' |
  '@isac:public.workflow(flow_id,variation,params?)' |
  '@isac:chatbot.home' | 
  '@isac:chatbot.manage(module_name)' |
  '@isac:chatbot.contact_list(module_name)' |
  '@hub:admin_panel.companies' |
  '@hub:auth.login' |
  '@hub:auth.logout' |
  '@hub:profile.home' |
  '@hub:old_cap.alert' |
  '@hub:old_cap.home' |
  '@hub:old_cap.docs(id)' |
  '@hub:old_cap.models' |
  '@hub:reconciliation.home' |
  '@hub:reconciliation.manage' |
  '@hub:reconciliation.history' |
  '@hub:admin_panel.client' |
  '@hub:admin_panel.users' |
  '@hub:admin_panel.projects' |
  '@hub:admin_panel.dashboards' |
  '@hub:admin_panel.integrations.whatsapp' |
  '@hub:admin_panel.users_by_client' |
  '@hub:dashboard.home' |
  '@hub:dashboard.show(slug)' |
  '@hub:icon' |
  '@hub:gallery.home' |
  '@hub:gallery.show(id)' |
  '@hub:closing_folder.home' |
  '@hub:notification.all' |
  '@hub:notification.preference' |
  '@hub:notification.create' |
  '@hub:support.home' |
  '@hub:support.details(_id)' |
  '@hub:session.home' |
  '@isac_back:public_route(flow_id,variation)'

/**
 * *obs. Use handleRegexUrl('custom-url' as any) para ignorar o erro de tipagem.*
 * 
 * 
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
export const handleRegexUrl = (url: AvailableRegexUrls, token?: string): string => {
  const getUrl = (url: string, prefix: string, routes: Record<string, any>) => {
    let queryParams = ''
    if (url.includes('?')) {
      const splitedUrl = url.split('?');
      url = splitedUrl[0]
      if (splitedUrl.length > 1) queryParams = `?${splitedUrl[1]}`
    }

    let withoutPrefix = url.replace(prefix, '')
    let route_name = withoutPrefix.includes('(') ? withoutPrefix.split('(')[0] : withoutPrefix
    let params = withoutPrefix.includes('(') ? withoutPrefix.split('(')[1].replace(')', '').split(',') : []

    const route = getRecursiveValue(route_name, { data: routes })

    if (typeof route !== 'function') {
      console.error('[invalid-regex-url]', { route, url })
      return url
    }

    return `${route(...params)}${queryParams}`
  }
  if (url.substring(0, 4) === 'http') return url

  let handledUrl: string | undefined = undefined
  if (url.includes('@hub:')) handledUrl = `${getDomain('hub', true)}${getUrl(url, '@hub:', hubRoutes)}`
  if (url.includes('@isac:')) handledUrl = `${getDomain('isac', true)}${getUrl(url, '@isac:', isacRoutes)}`
  if (url.includes('@isac_back:')) handledUrl = `${getDomain('isac_back', true)}${getUrl(url, '@isac_back:', isacBackRoutes)}`
  if (handledUrl) {
    if (token && handledUrl.substring(0, 4) === 'http' && !handledUrl.includes('?token=')) {
      if (handledUrl.includes('?')) return `${handledUrl}&token=${token}`
      return `${handledUrl}?token=${token}`
    }

    return handledUrl;
  }

  return url
}
export const getDomain = (application: 'hub' | 'isac' | 'isac_back' |  'hub_back', removeLastSlash = false) => {
  let urls = { hub: '', isac: '', isac_back: '', hub_back: '' }
  try {
    // @ts-ignore
    const WORKFLOW_MODULE = process.env.REACT_APP_WORKFLOW_MODULAR;
    urls.isac = WORKFLOW_MODULE!;
    // @ts-ignore
    urls.isac_back = process.env.REACT_APP_API_WF_URL
    // @ts-ignore
    urls.hub_back = process.env.REACT_APP_BASE_URL
  } catch (e) { }
  try {
    // @ts-ignore
    const PORTAL = import.meta.env.VITE_PORTAL_URL;
    urls.hub = PORTAL!;
    // @ts-ignore
    urls.isac_back = import.meta.env.VITE_BASE_URL
    // @ts-ignore
    urls.hub_back = import.meta.env.VITE_AUTH_URL
  } catch (e) { }

  let url = urls[application] ?? '';
  if (removeLastSlash && application !== 'isac_back' && url.substr(-1) === '/') url = url.substr(0, url.length - 1)

  return url
}
export const getSupportKeys = () => {
  let support : { flow_id: string, steps: Record<(
    "open-request-called" |
    "internal-approval" |
    "in-progress" |
    "internal-test" |
    "approval-test" |
    "called-closed"
  ), string> }= { flow_id: '', steps: {} as any };

  try {
    // @ts-ignore
    support.flow_id = import.meta.env.VITE_SUPPORT_FLOW_ID;
    // @ts-ignore
    support.steps["open-request-called"] = import.meta.env.VITE_SUPPORT_OPEN_REQUEST_CALLED;
    // @ts-ignore
    support.steps["internal-approval"] = import.meta.env.VITE_SUPPORT_INTERNAL_APPROVAL;
    // @ts-ignore
    support.steps["in-progress"] = import.meta.env.VITE_SUPPORT_IN_PROGRESS;
    // @ts-ignore
    support.steps["internal-test"] = import.meta.env.VITE_SUPPORT_INTERNAL_TEST;
    // @ts-ignore
    support.steps["approval-test"] = import.meta.env.VITE_SUPPORT_APPROVAL_TEST;
    // @ts-ignore
    support.steps["called-closed"] = import.meta.env.VITE_SUPPORT_CALLED_CLOSED;
  } catch (e) {
    try {
      // @ts-ignore
      support.flow_id = process.env.REACT_APP_SUPPORT_FLOW_ID;
      // @ts-ignore
      support.steps["open-request-called"] = process.env.REACT_APP_SUPPORT_OPEN_REQUEST_CALLED;
      // @ts-ignore
      support.steps["internal-approval"] = process.env.REACT_APP_SUPPORT_INTERNAL_APPROVAL;
      // @ts-ignore
      support.steps["in-progress"] = process.env.REACT_APP_SUPPORT_IN_PROGRESS;
      // @ts-ignore
      support.steps["internal-test"] = process.env.REACT_APP_SUPPORT_INTERNAL_TEST;
      // @ts-ignore
      support.steps["approval-test"] = process.env.REACT_APP_SUPPORT_APPROVAL_TEST;
      // @ts-ignore
      support.steps["called-closed"] = process.env.REACT_APP_SUPPORT_CALLED_CLOSED;
    } catch (e) { }
  }
  
  return support
}