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
    /** strc */
    render?: string,
    switch_render?: string[],
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
  /**
   * URL do template de importação para download. \
   * Caso não seja informado, será gerado um template com base \
   * na parametrização das colunas.
   */
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
  required?: boolean,
  rules?: {
    /**
     * Modificadores de string, é um array de substituições, onde \
     * cada substituição é composta por duas strings, a str de pesquisa \
     * e o valor a ser substituido.
     */
    str_replacers?: Array<[string, string]>
  }
}
export interface IntegrationOmieType {
  key: string,
  type: 'omie',
  mode: 'integration',
  label?: string,
  placeholder?: string,
  required?: boolean,
  rules?: {
    render?: string,
    switch_render?: string[]
  },
  scope: string
}

export type SubhandlerType = {
  /** verifica se na linha atual tem o search */
  search: string;
  /** Modo para pegar o valor */
  mode: 'all' | 'includes' | 'after-includes' | 'before-includes';
  /** quantos caracteres devem ser capturados ou até qual string */
  range?: number | string;
  /** Local onde será adicionado o valor */
  key: string;
  /** Adicionar uma formatação especial ao salvar o valor */
  formatter?: IntegrationExcelColumnTypeType;
}

export type HandlerPDFType = {
  /**
   * Inicio onde iniciara a busca pelas propriedades do object \
   * palavra - será iniciado quando a row for igual a palavra
   * palavra% - será iniciado quando a row tiver o inicio igual a palavra
   * %palavra - será iniciado quando a row tiver o fim igual a palavra
   * %palavra% - será iniciado quando a row incluir palavra
  */
  start_search: string;
  /**
   * Fim onde finalizara a busca pelas propriedades do object \
   * palavra - será iniciado quando a row for igual a palavra \
   * palavra% - será iniciado quando a row tiver o inicio igual a palavra \
   * %palavra - será iniciado quando a row tiver o fim igual a palavra \
   * %palavra% - será iniciado quando a row incluir palavra \
  */
  end_search: string;
  /** Defini quais propriedades serao buscadas */
  columns: SubhandlerType[];
  /** Local onde será adicionado o valor */
  key: string;
}

export type HandlersType = HandlerPDFType[];
export interface IntegrationPDFType {
  key: string,
  type: 'pdf',
  mode: 'integration',
  label?: string,
  placeholder?: string,
  required?: boolean,
  scope: string,
  handlers: HandlersType,
  append_values?: Record<string, any>,
  rules?: {
    render?: string
  },
  /** Entitidade para salvar o registro de importação da planilha */
  import_registration?: string,
}
export type IntegrationsType = IntegrationExcelType | IntegrationOmieType | IntegrationPDFType;