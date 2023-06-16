export type IntegrationTypeType = 'excel' | 'omie';
export const integrationTypeFormatted : Record<IntegrationTypeType, string> = {
  excel: 'Excel (Importação)',
  omie: 'Integração c/ Omie'
};

export type IntegrationExcelColumnTypeType = 'text' | 'date' | 'email' | 'phone' | 'percent' | 'money' | 'number' | 'cpf-cnpj';
export const integrationExcelColumnType : IntegrationExcelColumnTypeType[] = ['text', 'date', 'email', 'phone', 'percent', 'money', 'number', 'cpf-cnpj'];
export const integrationExcelColumnTypeFormatted : Record<IntegrationExcelColumnTypeType, string> = {
  text: 'Texto',
  date: 'Data',
  email: 'Email',
  phone: 'Telefone',
  percent: 'Percentual',
  money: 'Moeda',
  number: 'Numérico',
  'cpf-cnpj': 'CPF/CNPJ'
};
export type AvailableScopeExcelType = 'invoiced' | 'downloaded' | 'defaulter';
export const availableScopeExcel : AvailableScopeExcelType[] = ['invoiced', 'downloaded', 'defaulter'];
export const availableScopeExcelFormatted : Record<AvailableScopeExcelType, string> = {
  invoiced: 'Faturados',
  downloaded: 'Baixados',
  defaulter: 'Inadimplentes'
}

export interface IntegrationExcelType{
  key: string,
  type: 'excel',
  mode: 'integration',  
  label?: string,
  placeholder?: string,
  required?: boolean,
  rules?: {},
  scope: AvailableScopeExcelType,
  columns?: IntegrationExcelColumnType[]
}
export interface IntegrationExcelColumnType{
  id: string,
  name: string,
  type: IntegrationExcelColumnTypeType,
  required?: boolean
}
export interface IntegrationOmieType{
  key: string,
  type: 'omie',
  mode: 'integration',  
  label?: string,
  placeholder?: string,
  required?: boolean,
  rules?: {},
  scope: AvailableScopeExcelType
}
export type IntegrationsType = IntegrationExcelType | IntegrationOmieType;