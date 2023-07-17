import { IntegrationExcelColumnTypeType, PermissionType } from "."

export type AvailableServicesType = 'email'|'whatsapp'|'sms'|'chatbot';
export type AvailableViewModeType = 'table' | 'dashboard';
export interface WorkflowConfigFilterType{
  name: string,
  type: 'text' | 'date' | 'select',
  ref: string | string[],
  options?: string[],
  autocomplete?: string // somente autocomplete.mode = 'distinct'
}
export interface IntegrationEmailSimple{

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
  type: 'append',
  execute: 'before' | 'after',
  condition?: string,
  unique?: boolean,
  value?: string,
}
export interface ConfigViewModeColumnsType{
  id: string,
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
export interface WorkflowConfigType{
  actions?: WorkflowConfigActionsType[],
  view_modes?: WorkflowViewModeTable[],
  filters?: WorkflowConfigFilterType[],
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
    auth?: {
      props: {
        email: string,
        name: string,
        link: string,
        template?: {
          id: string,
          type: 'email' | 'message',
          params: Record<string, string>,
          matchs: Record<string, string>
        }[]
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
    },
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