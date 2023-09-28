import { UserCategory } from "."

export enum PossiblePermissions {
  ADMIN                = 'admin',
  GESTAO               = 'gestao',
  DASH                 = 'dash',
  ISAC                 = 'isac',
  FINANCEIRO           = 'financeiro',
  ADMIN_HUB            = 'admin-hub',
  MANAGE_NOTIFICATION  = 'manage-notification',
  INTEGRATION_WHATSAPP = 'integration-whatsapp',

  // descontinuado ===============
  APPROVAL             = 'aprovacao',
  FINANCIAL_APPROVAL   = 'aprovacao-financeiro',
  EXCLUSION            = 'exclusao',
  EDITION              = 'edicao',
  CONTAS_A_PAGAR       = 'cap',
  PLANILHA             = 'sheet',
}
export const availablePossiblePermissions : UserCategory[] = [
  {
   id: 'hub-admin',                slug: 'admin',                permitions: [{ id: 'admin', name: '' }],
   clientId:'', name: 'Administrador',          description: 'Administrador pode gerenciar informações sobre a empresa'
  },
  {
   id: 'hub-gestao',               slug: 'gestao',               permitions: [{ id: 'gestao', name: '' }],
   clientId:'', name: 'Gestão',                 description: 'Gestão envolve permissões com relatórios'
  },
  {
   id: 'hub-dash',                 slug: 'dash',                 permitions: [{ id: 'dash', name: '' }],                 
   clientId:'', name: 'Dashboard',              description: 'Permissão de acesso a Dashboard'
  },
  {
   id: 'hub-isac',                 slug: 'isac',                 permitions: [{ id: 'isac', name: '' }],                 
   clientId:'', name: 'ISAC',                   description: 'Permissão de acesso ao ISAC'
  },
  {
   id: 'hub-admin-hub',            slug: 'admin-hub',            permitions: [{ id: 'admin-hub', name: '' }],            
   clientId:'', name: 'Admin da Plataforma',    description: 'Permissão de administração da plataforma'
  },
  {
   id: 'hub-manage-notification',  slug: 'manage-notification',  permitions: [{ id: 'manage-notification', name: '' }],  
   clientId:'', name: 'Gerenciar Notificações', description: 'Gerenciamento de notificações'
  },
  {
   id: 'hub-integration-whatsapp', slug: 'integration-whatsapp', permitions: [{ id: 'integration-whatsapp', name: '' }], 
   clientId:'', name: 'Integração de Whatsapp', description: 'Gerenciamento de Integração do Whatsapp'
  },
  {
    id: 'hub-financeiro',           slug: 'financeiro',           permitions: [{ id: 'financeiro', name: '' }],           
    clientId:'', name: 'Finaceiro',              description: '(antiga) Permissão financeiro no CAP'
  },
  {
   id: 'hub-aprovacao',            slug: 'aprovacao',            permitions: [{ id: 'aprovacao', name: '' }],            
   clientId:'', name: 'Aprovação',             description: '(antiga) Permissão de aprovação no CAP'
  },
  {
   id: 'hub-aprovacao-financeiro', slug: 'aprovacao-financeiro', permitions: [{ id: 'aprovacao-financeiro', name: '' }], 
   clientId:'', name: 'Aprovação Financeiro',  description: '(antiga) Permissão de aprovação financeria no CAP'
  },
  {
   id: 'hub-exclusao',             slug: 'exclusao',             permitions: [{ id: 'exclusao', name: '' }],             
   clientId:'', name: 'Exclusão',              description: '(antiga) Permissão de exclusão'
  },
  {
   id: 'hub-edicao',               slug: 'edicao',               permitions: [{ id: 'edicao', name: '' }],               
   clientId:'', name: 'Edição',                description: '(antiga) Permissão de edição'
  },
  {
   id: 'hub-cap',                  slug: 'cap',                  permitions: [{ id: 'cap', name: '' }],                  
   clientId:'', name: 'Contas a Pagar',        description: '(antiga) Permissão CAP'
  },
  {
   id: 'hub-sheet',                slug: 'sheet',                permitions: [{ id: 'sheet', name: '' }],                
   clientId:'', name: 'Planilhas',             description: '(antiga) Permissão de gerenciamento de planilha'
  },
]
export interface PermissionType{
  name: string,
  actions: string[]
}
export interface Permition{
  id: string,
  name: string,
  slug?: string,
  description?: string,
}