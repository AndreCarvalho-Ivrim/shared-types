import { IntegrationExcelColumnTypeType, PermissionType } from "."

export type AvailableServicesType = 'email'|'whatsapp'|'sms'|'chatbot';
export type AvailableViewModeType = 'table' | 'dashboard';
export interface WorkflowConfigType{
  asideButtons?: ConfigAsideButtonType[],
  table?: {
    view_mode: AvailableViewModeType,
    columns: ConfigViewModeColumnsType[]
  },
  filters?: [],
  permissions?: ConfigPermissionType,
  triggers?: [],
  webhooks?: [],
  notifications?: [],
  integrations?: Record<AvailableServicesType, (any | undefined)>
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