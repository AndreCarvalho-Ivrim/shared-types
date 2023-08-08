export enum PossiblePermissions {
  ADMIN                = 'admin',
  GESTAO               = 'gestao',
  DASH                 = 'dash',
  ISAC                 = 'isac',
  FINANCEIRO           = 'financeiro',
  ADMIN_HUB            = 'admin-hub',
  INTEGRATION_WHATSAPP = 'integration-whatsapp',

  // descontinuado ===============
  APPROVAL             = 'aprovacao',
  FINANCIAL_APPROVAL   = 'aprovacao-financeiro',
  EXCLUSION            = 'exclusao',
  EDITION              = 'edicao',
  CONTAS_A_PAGAR       = 'cap',
  PLANILHA             = 'sheet',
}
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