export enum PossiblePermissions {
  APPROVAL = 'aprovacao',
  ADMIN =  'admin',
  FINANCIAL_APPROVAL = 'aprovacao-financeiro',
  EXCLUSION = 'exclusao',
  EDITION = 'edicao',
  CONTAS_A_PAGAR = 'cap',
  GESTAO = 'gestao',
  PLANILHA = 'sheet',
  DASH= 'dash'
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