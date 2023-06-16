import { Permition, PossiblePermissions } from './permission.type';
import { StepItemType } from './step.item.field.type';
import { IntegrationsType } from './step.item.integration.type';
import { StepViewType } from './step.item.view.type';
import { WidgetType } from './step.item.widget.type';
import { WorkflowConfigType } from './workflow.config.type';

export interface PermissionType{
  name: string,
  actions: string[]
}
export interface ResultAndResponse{
  result: boolean,
  response: string
}
export interface User{
  id: string;
  email: string,
  picture: string,
  active?: boolean,
  name: string,
  clients?: Client[],
  permitions?: Permition[],
  permitions_slug?: PossiblePermissions[],
  flow_permission?: string,
  flow_actions_permitted?: string[],
  client_name?: string,
  token: string,
  current_client: string,
  userCategories?: UserCategory[],
  userCategory?: UserCategory
}
export interface Client{
  id: string,
  cnpj: string,
  razao_social: string,
  nome_fantasia: string,
  picture: string,

  cep: string,
  logradouro: string,
  numero: string,
  bairro: string,
  cidade: string,
  estado: string,
  
  ddd: string,
  telefone: string,
  email: string,

  sheet?: Sheet
  users?: User[],

  active?: boolean
}
export interface UserCategory{
  id: string,
  slug: string,
  name: string,
  description: string,
  clientId: string,
  permitions: Permition[] 
}
export interface Sheet{
  clientId?: string
  src?: string
  name: string
  comments: string
  formatedRows?: any[]
}

export type AvailableWorkflowThemeType = 'Cobrança' | 'Comercial';
export const availableWorkflowTypes = ['Cobrança','Comercial']; 

export type AvailableWorkflowStatusType = 'published' | 'edition';
export const availableWorkflowStatus : AvailableWorkflowStatusType[] = ['published', 'edition'];
export const availableWorkflowStatusFormatted = {
  published: 'Publicado', edition: 'Em Edição'
}

export type AvailableViewModeType = 'table' | 'dashboard';

export interface WorkflowType{
  _id: string,
  theme: AvailableWorkflowThemeType,
  created_at: string,
  date: string,
  title: string,
  description: string,
  user_id: string,
  user_name: string,
  status: AvailableWorkflowStatusType,
  config?: WorkflowConfigType
}

export type StepItemModeType = 'field' | 'view' | 'widget' | 'integration';
export type ItemOrViewOrWidgetOrIntegration = StepItemType | IntegrationsType | StepViewType | WidgetType;

export interface FlowPermissionOnUserType{
  flow_permission: string,
  flow_actions_permitted: string[],
}

export * from './permission.type';
export * from './workflow.type';
export * from './workflow.config.type';
export * from './step.action.type';
export * from './step.item.field.type';
export * from './step.item.integration.type';
export * from './step.item.view.type';
export * from './step.item.widget.type';
export * from './step.type';