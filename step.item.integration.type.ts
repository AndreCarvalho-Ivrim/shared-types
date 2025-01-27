export type IntegrationTypeType = 'excel' | 'omie';
export const integrationTypeFormatted: Record<IntegrationTypeType, string> = {
  excel: 'Excel (Importação)',
  omie: 'Integração c/ Omie'
};

export type IntegrationExcelColumnTypeType = 'text' | 'date' | 'time' | 'datetime' | 'email' | 'phone' | 'percent' | 'money' | 'number' | 'cpf-cnpj';
export const integrationExcelColumnType: IntegrationExcelColumnTypeType[] = ['text', 'date', 'time', 'datetime', 'email', 'phone', 'percent', 'money', 'number', 'cpf-cnpj'];
export const integrationExcelColumnTypeFormatted: Record<IntegrationExcelColumnTypeType, string> = {
  text: 'Texto',
  date: 'Data',
  time: 'Hora',
  datetime: 'Data e Hora',
  email: 'Email',
  phone: 'Telefone',
  percent: 'Percentual',
  money: 'Moeda',
  number: 'Numérico',
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
      exception?: 'ability-check-dates',
      error_message?: string
    }
    /**
     * Se restrict === true, ele disparará erro caso uma coluna required \
     * não for preenchido. No caso contrário, ignorará a linha
     */
    restrict?: boolean,
    formatter?: IntegrationExcelRulesFormatterType,
    /** Filtra os dados de importação */
    filters?: IntegrationExcelFilterRule[]
  },
  scope: string,
  columns?: IntegrationExcelColumnType[],
  append_values?: Record<string, any>,
  /** URL do template de importação para download */
  model_url?: string,
  /** Entitidade para salvar o registro de importação da planilha */
  import_registration?: string,
}
export interface IntegrationExcelFilterRule{
  /** Nome da coluna a ser filtrada, deve ser o mesmo usado na planilha */
  column: string,
  type: 'eq' | 'like' | 'in' | 'not' | 'not-like' | 'nin',
  value: any
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