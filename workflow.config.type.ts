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
export interface WorkflowTableColumn{
  id: string,
  name: string,
  type: IntegrationExcelColumnTypeType  
}
export interface WorkflowViewModeTable{
  view_mode: 'table',
  columns: WorkflowTableColumn[],
  order_by?: { ref: string, orientation?: 'desc' | 'asc' }
}
export interface WorkflowConfigType{
  asideButtons?: ConfigAsideButtonType[],
  table?: {
    view_mode: AvailableViewModeType,
    columns: ConfigViewModeColumnsType[]
  },
  view_modes: WorkflowViewModeTable[],
  filters?: WorkflowConfigFilterType[],
  permissions?: ConfigPermissionType,
  triggers?: [],
  webhooks?: [],
  notifications?: [],
  integrations?: Record<AvailableServicesType, (any | undefined)>,
  services?: {
    auth?: {
      props: { email: string, name: string, link: string },
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
export interface ConfigViewModeColumnsType{
  id: string,
  name: string,
  type: IntegrationExcelColumnTypeType
}
export interface ConfigAsideButtonType{
  icon: 'new' | 'update' | 'delete' | 'alarm' | 'search' | 'models',
  id: 'start-flow' | 'list-datas' | 'delete-datas' | 'alarm' | 'search' | 'models',
  alt: string,
  action_permission?: string
}
export interface ConfigPermissionType{
  groups: PermissionType[]
  actions: string[]
}