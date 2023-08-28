import { IntegrationExcelColumnTypeType, PermissionType } from "."

export type AvailableServicesType = 'email'|'whatsapp'|'sms'|'chatbot';
export type AvailableViewModeType = 'table' | 'dashboard';
export type WorkflowConfigFilterRefType = '@user.name' | '@user.email' | '@owner.name' | '@owner.email' | '@created_at' | '@step_id' | string
export interface WorkflowConfigFilterType{
  name: string,
  type: 'text' | 'date' | 'select' | 'list',
  ref: WorkflowConfigFilterRefType | WorkflowConfigFilterRefType[],
  options?: string[],
  autocomplete?: string // somente autocomplete.mode = 'distinct'
}
export interface WorkflowConfigNotificationType{
  name: string,
  condition: string,
  template_id: string,
  type: 'email' | 'message',
  params: Record<string, string>,
  replacers: Record<string, string>,
  target: '@data_creator' | '@data_owner' | '@wf_owner' | string,
  /**
   * [@data_creator]                Criador do flow data
   * [@data_owners]                 Responsáveis pelo flow data
   * [@wf_owner]                    Responsável pelo workflow
   * [@to:<contact1>[,<contact2>]]  Contato(s) pré-definido(s)
   * 'path-to-contact'              Caminho para o registro dentro do flow_data.data 
   *                                que contenha o contato
   */
}
export interface WorkflowConfigAutocomplete{
  name: string,
  mode: 'distinct' | 'search',
  ref: string,
  response?: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>, 
}
export interface WorkflowConfigObserverFnType{
  name: string,
  /** EVENTS -> available names on type event
   * @prevent-stock-out: Evento de revalidação de estoque na estrutura do WF Duzani
   */
  type: 'append' | 'backup' | 'event',
  execute: 'before' | 'after',
  condition?: string,
  unique?: boolean,
  value?: string,
}
export interface ConfigViewModeColumnsType{
  id: '@user' | '@owners' | 'created_at' | 'step' | string,
  name: string,
  type: IntegrationExcelColumnTypeType
}
export interface WorkflowViewModeTable{
  view_mode: 'table',
  title: string,
  slug: string,
  columns: ConfigViewModeColumnsType[],
  order_by?: { ref: string, orientation?: 'desc' | 'asc' }
}
export interface WorkflowAuthTemplateType{
  id: string,
  type: 'email' | 'message',
  params: Record<string, string>,
  matchs: Record<string, string>
}
export interface WorkflowAuthType{
  props: {
    email: string,
    name: string,
    link: string,
    template?: WorkflowAuthTemplateType[]
  },
  body: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>, 
  /**
   * [@link-auth]     Link para o primeiro login, e em seguida a definição da senha
   * [@temp-password] Enviar senha temporária por email/whatsapp
   * [@manual]        Cria a senha no momento do cadastro
   */
  mode_start: '@link-auth' | '@first-password' | '@manual',
  notify: { email?: string, whatsapp?: string, sms?: string },
  routes: {
    get: Record<string,{
      body: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>
    }>,
    post: Record<string,{
      scope?: string,
      body: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>,
      mode: 'merge' | 'overwrite'
    }>,
  }
}
export interface WorkflowConfigType{
  actions?: WorkflowConfigActionsType[],
  view_modes?: WorkflowViewModeTable[],
  filters?: Record<string, WorkflowConfigFilterType[]>,
  permissions?: ConfigPermissionType,
  triggers?: [],
  webhooks?: [],
  notifications?: WorkflowConfigNotificationType[],
  integrations?: {
    email?: {
      emailFrom?: string,
      host?: string,
      port?: number,
      auth?: { user: string, pass: string }
    },
    whatsapp?: { number: string, token: string },
    sms?: any,
    chatbot?: any
  },
  services?: {
    auth?: WorkflowAuthType,
    autocomplete?: WorkflowConfigAutocomplete[],
    observers?: {
      onCreate?: WorkflowConfigObserverFnType[],
      onUpdate?: WorkflowConfigObserverFnType[],
      onDelete?: WorkflowConfigObserverFnType[]
    }
  }
  owner?: {
    id?: string
    name: string,
    cnpj: string,
    email: string,
    whatsapp: string
  }
}
export interface WorkflowConfigActionsType{
  icon?: 'new' | 'update' | 'delete' | 'alarm' | 'search' | 'models',
  id: 'start-flow' | 'list-datas' | 'delete-datas' | 'alarm' | 'search' | 'models' | string,
  alt: string,
  action_permission?: string
}
export interface ConfigPermissionType{
  groups: PermissionType[]
  actions: string[]
}