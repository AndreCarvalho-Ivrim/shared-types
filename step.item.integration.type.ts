export type IntegrationTypeType = 'excel' | 'omie';
export const integrationTypeFormatted: Record<IntegrationTypeType, string> = {
  excel: 'Excel (Importação)',
  omie: 'Integração c/ Omie'
};

export type IntegrationExcelColumnTypeType = 'text' | 'date' | 'email' | 'phone' | 'percent' | 'money' | 'number' | 'cpf-cnpj';
export const integrationExcelColumnType: IntegrationExcelColumnTypeType[] = ['text', 'date', 'email', 'phone', 'percent', 'money', 'number', 'cpf-cnpj'];
export const integrationExcelColumnTypeFormatted: Record<IntegrationExcelColumnTypeType, string> = {
  text: 'Texto',
  date: 'Data',
  email: 'Email',
  phone: 'Telefone',
  percent: 'Percentual',
  money: 'Moeda',
  number: 'Numérico',
  'cpf-cnpj': 'CPF/CNPJ'
};

export interface IntegrationExcelType {
  key: string,
  type: 'excel',
  mode: 'integration',
  label?: string,
  placeholder?: string,
  required?: boolean,
  rules?: {
    duplicity?: {
      id: string,
      match: string[],
      replacers?: string[],
      mode: 'merge' | 'overwrite' | 'replacer'
    },
    unique?: {
      match: string[],
      replacers?: string[],
      mode: 'merge' | 'overwrite' | 'replacer' | 'error',
      error_message?: string
    }
    /**
     * Se restrict === true, ele disparará erro caso uma coluna required \
     * não for preenchido. No caso contrário, ignorará a linha
     */
    restrict?: boolean
    formatter?: {
      separator?: string,
    }
  },
  scope: string,
  columns?: IntegrationExcelColumnType[],
}
export interface IntegrationExcelColumnType {
  id: string,
  name: string,
  type: IntegrationExcelColumnTypeType,
  required?: boolean
}
export interface IntegrationOmieType {
  key: string,
  type: 'omie',
  mode: 'integration',
  label?: string,
  placeholder?: string,
  required?: boolean,
  rules?: {},
  scope: string
}
export type IntegrationsType = IntegrationExcelType | IntegrationOmieType;