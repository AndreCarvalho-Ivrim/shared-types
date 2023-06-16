import { Permition, PossiblePermissions } from './permission.type';

export * from './permission.type';
export * from './workflow.type';
export * from './workflow.config.type';

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