import { StepItemCustomList, StepItemCustomListDraggable, StepItemType } from ".";

export type IntegrationTypeType = 'excel' | 'pdf' | 'omie';
export const integrationTypeFormatted: Record<IntegrationTypeType, string> = {
  excel: 'Excel (Importação)',
  omie: 'Integração c/ Omie',
  pdf: 'PDF'
};

export type IntegrationExcelColumnTypeType = 'text' | 'date' | 'time' | 'datetime' | 'email' | 'phone' | 'percent' | 'money' | 'number' | 'cpf-cnpj' | 'thumbnail' | 'custom';
export const integrationExcelColumnType: IntegrationExcelColumnTypeType[] = ['text', 'date', 'time', 'datetime', 'email', 'phone', 'percent', 'money', 'number', 'cpf-cnpj', 'thumbnail', 'custom'];
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
  'cpf-cnpj': 'CPF/CNPJ',
  'thumbnail': 'thumbnail',
  custom: 'Customizado'
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
    filters?: IntegrationExcelFilterRule[],
    is_update?: boolean,
    accumulate_errors?: boolean
  },
  scope: string,
  columns?: IntegrationExcelColumnType[],
  /**
   * Permite a configuração dos campos dinamicamente, com os campos de columns sendo a base para contrução \
   * podendo personalizar os nomes de match, e também podem adicionar campos a mais, dependendo da configuração \
   * adicionada.
   **/
  dynamic_schema?: {
    /** Entidade que armazenará os modelos criados */
    entity_id: string,
    /** Propriedade do flow-data que armazenará o modelo selecionado */
    store_selected_template: string,
    /** Opção que define se permitirá campos adicionais ou não */
    allows_additional_fields?: boolean,
    /**
     * Caso a opção [allows_additional_fields] estiver verdadeira, essa opção permitir \
     * configurar o nome da propriedade que ira armazenar os campos adicionais
     **/
    store_outher_fields?: string,
    /** Caso queira armazenar a versão da dynamic_schema importada, especifique o nome do caminho */
    imported_version?: string
  },
  /**
   * Faz o pré-processamento do excel no frontend, interpretando a planilha e lidando com os erros no lado do front antes \
   * de enviar os dados
   * 
   * (Recomendado utilizar em conjunto com o dynamic_schema)
   */
  preprocess?: {
    /** Caso queira salvar a ordem e nome das colunas, especifique o nome da prop que armazenará esses dados */
    save_order_columns?: string,
    /** Caso queira salvar dados não conhecidos, especifique o nome da prop que armazerá esses dados */
    save_outher_fields?: string,
    /**
     * Caso haja campos opcionais e que precisem obrigatoriamente ser associados, marcar essa opção.
     * 
     * Se a posição do array for um array em vez de string quer dizer que pelo menos um dos valores \
     * deve ser válido. Exemplo:
     * 
     * ``` required_associations: ['field-1', ['field-2', 'field-3']] ```
     * 
     * Isso quer dizer que o field-1 é obrigatório, e que é obrigatório preencher o field-2 ou field-3
     **/
    required_associations?: (string | string[] | {
      condition: string,
      ref: string | string[]
    })[],
    validate_fields?: {
      validate_type?: 'all' | string[];
      valid_options?: {
        id: string,
        options?: { value: string, name: string }[],
        autocomplete?: StepItemType['autocomplete'],
        is_multiple?: true,
        separator?: ',',
      }[],
    }
  }
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
    condition?: string,
    outher_values?: string[],
    /**
     * Modificadores de string, é um array de substituições, onde \
     * cada substituição é composta por duas strings, a str de pesquisa \
     * e o valor a ser substituido.
     */
    str_replacers?: Array<[string, string]>
  },
  customData?: StepItemCustomListDraggable | StepItemCustomList | {
      mode: "@list-draggable";
      settings?: any;
  } | undefined
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
  mode: 'all' | 'includes' | 'after-includes' | 'before-includes' | 'ignore';
  /** quantos caracteres devem ser capturados ou até qual string */
  range?: number | string;
  /** Local onde será adicionado o valor */
  key: string;
  /** Utilizado para mostrar visualização no pré-processamento */
  title: string,
  /** Adicionar uma formatação especial ao salvar o valor \
   * split-comma - Separa os valores por vírgula \
   * split-non-alphanumeric - Separa os valores por caracteres especiais exeto espaço \
   */
  formatter?: IntegrationExcelColumnTypeType | 'split-comma' | 'split-non-alphanumeric';
  /** Letras ou caracteres que serão ignorados no formatter */
  ignore_formatter?: string[];
  /** Se for true, será salvo apenas uma vez */
  writeOnce?: boolean;
  required?: boolean
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
  /** Cada handler deve ter um indetificador unico */
  identifier: string;
  /** Nome de indentificação do handler */
  name: string
}

export interface IntegrationPDFType {
  key: string,
  type: 'pdf',
  mode: 'integration',
  /** Margem de erro para quebra de linha considerando eixo Y */
  y_axis_margin_of_error?: number,
  label?: string,
  placeholder?: string,
  required?: boolean,
  scope: string,
  handlers: HandlerPDFType[],
  append_values?: Record<string, any>,
  rules?: {
    render?: string,
    switch_render?: string[]
  },
  /** Entitidade para salvar o registro de importação da planilha */
  import_registration?: string,
  preprocess?: boolean
}
export type IntegrationsType = IntegrationExcelType | IntegrationOmieType | IntegrationPDFType;