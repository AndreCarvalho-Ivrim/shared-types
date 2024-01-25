import { Permition, PossiblePermissions } from './permission.type';
import { StepItemType } from './step.item.field.type';
import { IntegrationsType } from './step.item.integration.type';
import { StepViewType } from './step.item.view.type';
import { WidgetType } from './step.item.widget.type';

export interface PermissionType{
  name: string,
  actions: string[]
}
export interface ResultAndResponse{
  result: boolean,
  response: string
}
export interface ShortUser{
  id: string,
  name: string,
  email: string,
  picture: string,
  whatsapp?: string,
}
export interface User extends ShortUser{
  active?: boolean,
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

  active?: boolean,

  userCategories?: UserCategory[],

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

export interface FlowPermissionOnUserType{
  flow_permission: string,
  flow_actions_permitted: string[],
}

export type StringConditionalTypes = 'prop' | 'operator' | 'value' | 'logic';
export type ItemOrViewOrWidgetOrIntegration = StepItemType | IntegrationsType | StepViewType | WidgetType;

export * from './permission.type';
export * from './workflow.type';
export * from './workflow.config.type';
export * from './workflow.entities.type';
export * from './step.action.type';
export * from './step.item.field.type';
export * from './step.item.integration.type';
export * from './step.item.view.type';
export * from './step.item.widget.type';
export * from './step.type';
export * from './dashboard.type';
export * from './closing_folder.type';