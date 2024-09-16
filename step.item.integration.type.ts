export type IntegrationTypeType = 'excel' | 'omie';
export const integrationTypeFormatted: Record<IntegrationTypeType, string> = {
  excel: 'Excel (Importação)',
  omie: 'Integração c/ Omie'
};

export type IntegrationExcelColumnTypeType = 'text' | 'date' | 'email' | 'phone' | 'percent' | 'money' | 'number' | 'cpf-cnpj' | 'time';
export const integrationExcelColumnType: IntegrationExcelColumnTypeType[] = ['text', 'date', 'email', 'phone', 'percent', 'money', 'number', 'cpf-cnpj', 'time'];
export const integrationExcelColumnTypeFormatted: Record<IntegrationExcelColumnTypeType, string> = {
  text: 'Texto',
  date: 'Data',
  email: 'Email',
  phone: 'Telefone',
  percent: 'Percentual',
  money: 'Moeda',
  number: 'Numérico',
  time: 'Hora',
  'cpf-cnpj': 'CPF/CNPJ'
};

export interface IntegrationExcelRulesFormatterType{
  /** Index da linha onde se encontra os títulos */
  header_index?: number,
  separator?: string,
}
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
    restrict?: boolean,
    formatter?: IntegrationExcelRulesFormatterType
  },
  scope: string,
  columns?: IntegrationExcelColumnType[],
  append_values?: Record<string, any>,
  /** URL do template de importação para download */
  model_url?: string
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