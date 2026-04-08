import { ConfigViewModeColumnsType, ItemOrViewOrWidgetOrIntegration } from ".";

export type StepItemAttrTypeType = 'text' | 'textarea' | 'select' | 'select-multiple' | 'radio' | 'checkbox' | 'date' | 'file' |  'file-multiple' |  'group-collapse' | 'custom' | 'datetime';
export const stepItemAttrTypeFormatted : Record<StepItemAttrTypeType,string> = {
  text: 'Entrada de Texto',
  textarea: 'Entrada de Texto Grande',
  select: 'Entrada de Seleção',
  'select-multiple': 'Entrada de Seleção Multipla',
  radio: 'Caixa de Seleção',
  checkbox: 'Caixa de Multipla Escolha',
  date: 'Date',
  datetime: 'Data e Hora',
  file: 'Upload de Arquivo',
  'file-multiple': 'Upload de Multiplos Arquivos',
  'group-collapse': 'Grupo de Campos Intercalável',
  custom: 'Customizado'
};

export type StepItemAttrMaskType = 'email' | 'number' | 'money' | 'cpf' | 'cnpj' | 'cpf-cnpj' | 'cep' | 'phone';
export const stepItemAttrMaskType : Record<StepItemAttrMaskType,string> = {
  email: 'E-mail',
  number: 'Número',
  money: 'Valor Monetário',
  cpf: 'CPF',
  cnpj: 'CNPJ',
  'cpf-cnpj': 'CPF/CNPJ',
  cep: 'CEP',
  phone: 'Telefone',
};
export type StepItemAttrMaskDynamicType = {
  type: 'number',
  /**
   * Separador Number: "-", "."
   */
  pattern: string,
  autocomplete?: { fill: string, direction: 'left' | 'right' },
  /** Quando esse campo está habilitado é possível desativar a formatação da máscara */
  optional?: boolean
}
export type StepItemAttrMaskStringType = {
  type: 'string',
  /**
   * Palavras que devem permanecer 100% em minúsculas
   */
  lowercaseWords: string[],
  /**
   * Quando esse campo está habilitado é possível desativar a formatação da máscara
   * 
   * Obs. Só funciona se o item possuir label
   **/
  optional?: boolean
}
export type ThemeColorType = 'primary' | 'success' | 'light' | 'danger' | 'warning' | 'info';
export type TargetModeType = 'single' | 'multiple' | 'trigger' | 'final';
export type StepItemModeType = 'field' | 'view' | 'widget' | 'integration';

export interface ValueAndNameStringType{
  value: string,
  name: string,
  condition?: string,
  /**
   * Adicione outras chaves com o prefix outhers. para que a seleção \
   * gere o preenchimento de um campo adjacente.
   */
  [key: string]: any,
  disabled?: {
    disabled: boolean;
    condition?: string;
    message?: string;
  }
}
export interface IDefaultValue{
  value: any,
  condition: string
}
export interface StepItemType{
  key: string,
  type: StepItemAttrTypeType,
  mode: 'field',
  mask?: StepItemAttrMaskType,
  dynamic_mask?: StepItemAttrMaskDynamicType | StepItemAttrMaskStringType,
  label?: string,
  placeholder?: string,
  subtitle?: string,
  options?: ValueAndNameStringType[],
  /** a single_option deve existir em options,
   * quando essa opção for selecionada as outras serão deselecionadas
   * caso essa esteja selecionada e outra seja selecionada essa será deselecionada  */
  single_option?: ValueAndNameStringType[],
  /** 
   * Utilizar @flow-data: para adicionar o value do flow data ao value do campo como default \
   * IDefaultValue[]: utilizado para definir o default value de acordo com condicional
   * */
  defaultValue?: any;
  required?: boolean,
  required_if?: string,
  switch_required_if?: string[],
  rules?: {
    min?: number,
    max?: number,
    conditional_max?: Record<string, number>,
    /**
     * - \@today: Minimo hoje com precisão de dia
     * - \@now: Minimo com precisão de segundos
     * - \@tomorrow: Amanhã
     * - -2d ou +2d (menos ou mais de dois dias)
     */
    minDate?: '@today' | '@now' | '@tomorrow' | string
    /** Segue a mesma regra do minDate */
    maxDate?: '@today' | '@now' | '@tomorrow' | string
    render?: string,
    switch_render?: string[],
    /**
     * AVAILABLE CUSTOM RULES\n
     * - [ignore]: Irá ignorar o campo na hora de salvar(só existe para controle de layout[geralmente usado em renderização \
     * condicional]), ou pesquisar
     * - [omit-if-empty]: Essa configuração é valida para campos select, geralmente quando utilizam conditional options ou \
     * autocomplete, para que o campo seja omitido caso não haja nenhuma opção válida.
     * - [omit-gallery]: Essa configuração é valida para file-multiple, para remover a funcionalidade de galeria
     *  
     * As regras abaixo só funcionam quando o Step.rule.customRule === '@find'
     * - [@find:select-unique (default)]: Irá usar este campo para pesquisa exata, e retornará apenas 1 resultado
     * - [@find:select]: Irá usar este campo para pesquisa exata ('texto pesquisado' === 'texto no banco')
     * - [@find:text]: Irá usar este campo para pesquisa parcial ('texto no banco'.includes('texto pesquisado'))
     * - [@find:date]: Irá usar este campo para pesquisa de range de data ('data no banco' está no 'range pesquisado')
     * - [@find:list]: Irá usar este campo para pesquisa em uma lista (['array pesquisado'].includes('texto no banco'))
     * - [@select-multiple-and-prorating]: Irá lidar com select multiplo e com capacidade de rateio e agrageção de dados
     * - [@filter-options]: Irá lidar com configurações adicionais para o options.
     */
    customRules?: string,
    step?: number,
    /** Se for type string é um strc(string conditional) */
    disabled?: boolean | string,
    dynamic_value?: string,
    restrictions?:{ condition: string, message: string }[],
    /**
     * Número de colunas. Válido para campos checkbox e radio
     */
    columns?: 1 | 2 | 3 | 4 | 5,
    /**
    * Apenas disponível na pesquisa de satisfação covabra
    */
    translate_options?: boolean,
    /**
    * Apenas disponível para textarea
    */
    rows?: number,
    /**
    * Esconde o campo
    */
    hidden?: boolean | string
  },
  observer?: boolean,
  items?: ItemOrViewOrWidgetOrIntegration[],
  autocomplete?: {
    /** 
     * Se iniciar com @ está se referindo alguma função hardcode, e não ao flow-entities, \
     * e se quiser usar um flow-entities externo deve iniciar com id do fluxo separado por \
     * \# como no exemplo abaixo:
     * 
     * ``` <flow-id>#<entity-key> ```
     * 
     * hardcode válidos:
     * - \@banks: Lista de bancos
     * - \@availableBranchsOfActivity: Lista de ramos de atividade
     * - \@cep-autocomplete: Autocomplete de CEP
     * - \@options: A lista será determinada no options do item
     * - \@fn-exception:\<variation\>: Chamará uma exceção do backend. Caso queira passar parametros, use a prop 'data'
     */
    name: string,
    /**
     * Quando utilizada essa função em um checkbox, ele armazena um array de objetos ao invés de um array primitivo \
     * com os values selecionados ficando em uma prop declarada nesse campo, e os demais outhers que compartilham da \
     * mesma raiz do caminho.
     */
    value_path?: string,
    /**
     * autocomplete.response => field to fill
     * ```
     * interface ToFillOnSelect{
     *   // Valor mostrado na option do select
     *   name: '<path-na-resposta>',
     *   // Valor no value da option do select
     *   value: '<path-na-resposta>',
     *   // Gerar preenchimento em outros campos, com base no selecionar
     *   [outhers.<path-no-flow-data>]?: '<path-na-resposta>'
     * }
     * ```
     * 
     * Quando autocomplete do tipo \@cep, o segundo parametro do record será \
     * o id dos campos que serão preenchidos, com o primeiro parametro tendo \
     * os seguintes valores válidos: logradouro, complemento, bairro, localidade, \
     * uf, ibge, gia, ddd, siafi, numero.
     * 
     * Importante: Para o autocomplete de cep afetar os demais campos é necessário em \
     * cada respectivo campo configurar o customData com o \@cep-autocomplete
     */
    toFill?: Record<string, string>,
    /** 
     * Mapeia campos da entidade selecionada para preencher automaticamente outros componentes da tela.
     * 
     * @example
     * autoFillTrigger: { 
     *   'campo_na_entidade': 'id-no-customData-do-destino' 
     * }
     * 
     * O componente de destino deve possuir:
     * customData: { mode: '@auto-fill', id: 'id-no-customData-do-destino' }
     */
    autoFillTrigger?: Record<string, string>,
    /**  Possibilidade de injetar opções */
    append_options?: {
      mode: 'before' | 'after',
      options: any[]
    }
    trigger?: { mode: 'keyup' } | {
      mode: 'clickToNext',
      target: string
    }
    /**
     * String condition, para filtrar os dados do autocomplete. \
     * Para acessar variáveis considere que:
     * - $\<variavel>: É uma variável dentro do valor retornado
     * - $flow_data:\<variavel>: É uma variável dentro do flow_data
     * - $observer:\<variavel>: É uma variável observável alterada em tempo de execução
     */
    filter_condition?: string,
    /** Adiciona uma opção no final para adicionar registro na base  informada */
    add_more_options?: boolean,
    data?: any
  },
  customData?: StepItemCustomDataSettings | StepItemCustomDataEditableTable | StepItemCustomDataCepAutocomplete | StepItemCustomDataCheckboxInHierarchy | StepItemCustomDataNumberWithUnitOfMeasurement | StepItemCustomDataEditableTableInline | StepItemCustomJson | {
    mode: '@select-multiple-and-prorating' | '@filter-options' | '@cluster-stores',
    settings?: any
  },
  is_expanded?: boolean
}
export type AvailableCustomItemModeType = '@select-multiple-and-prorating' | '@filter-options' | '@list' | '@editable-table' | '@checkbox-in-hierarchy' | '@link' | '@redirect-to' | '@json' | '@cluster-stores';
export const availableCustomItemMode : AvailableCustomItemModeType[] = ['@select-multiple-and-prorating', '@filter-options', '@list', '@editable-table', '@checkbox-in-hierarchy', '@link', '@redirect-to', '@cluster-stores'];
export interface StepItemCustomDataSettings{
  mode: '@list',
  settings: {
    mode: 'inline' | 'modal',
    /** Título que aparecerá no modal */
    title?: string,
    resume: ConfigViewModeColumnsType[],
    /** Utilizado para gerar novos valores a partir do split de um campo */
    split_field?: {
      key: string,
      separator: string
    }
  }
}
export interface StepItemCDETTableType extends ConfigViewModeColumnsType{
  required: boolean
}
export interface StepItemCustomDataEditableTable{
  mode: '@editable-table',
  settings: {
    /** Título que aparecerá no modal */
    title?: string,
    initial_value?: Record<string, any>[],
    readonly_if_fillable?: boolean,
    addable?: boolean,
    /**
     * Dividir uma coluna em N colunas, para acessar objeto interno
     */
    divide_columns?: Record<string, {
      key: string,
      label: string,
      type: StepItemAttrTypeType,
      mask?: StepItemAttrMaskType,
      required?: boolean
    }[]>
    replicate?: boolean | Record<string, string>,
    /**
     * Função que utiliza um item múltiplo como base para gerar multiplas \
     * linhas do editable-table, replicado os demais valores.
     **/
    spread_it_all?: {
      /** Elemento que será usado como base para o spread operator */
      target: string
    },
    /**
     * Se tiver items do tipo select-multiple, essas opções será usada para não permitir selecionar a mesma opção caso já selecionada
     **/
    not_repeat_option?: boolean,
    /**
     * Campos que serão ocultados no editable-table /
     * mas no back-end serão validados
     * */
    field_blacklist?: string[],
    disable_row_deletion?: boolean,
    disable_add_row?: boolean,
    restrictions?: EditableTableRestriction[]
  }
}
export interface EditableTableRestriction{
  type: 'exception',
  name: string, // Nome da exceção de validação
  data?: any
}
export interface EditableTableInlineInputs{
  key: string,
  type: 'text'
}
export interface StepItemCustomDataEditableTableInline{
  /** o @editable-table-inline tem suporte apenas a input de texto  */
  mode: '@editable-table-inline',
  settings: {
    /**
     * Define quais colunas serão inputs
     * */
    input_columns: EditableTableInlineInputs[],
    /** Título que aparecerá no modal */
    title?: string,
    initial_value?: Record<string, any>[],
    readonly_if_fillable?: boolean,
    replicate?: boolean | Record<string, string>,
    /**
     * Função que utiliza um item múltiplo como base para gerar multiplas \
     * linhas do editable-table, replicado os demais valores.
     **/
    spread_it_all?: {
      /** Elemento que será usado como base para o spread operator */
      target: string
    },
    /**
     * Campos que serão ocultados no editable-table /
     * mas no back-end serão validados
     * */
    field_blacklist?: string[],
    disable_row_deletion?: boolean,
    disable_add_row?: boolean,
    /** Configurações da planilha de exportação ou importação */
    sheets?: {
      export_sheet?: { name: string },
      import_sheet?: { name: string },
    }
  }
}
export interface StepItemCustomDataCepAutocomplete{
  mode: '@cep-autocomplete' | '@trigger-autocomplete',
  /** NÃO UTILIZADO */
  settings?: any,
  id: string
}
export type RecursiveRecordStrStr = {
  [key: string]: string | RecursiveRecordStrStr;
};
export interface StepItemCustomDataCheckboxInHierarchy{
  mode: '@checkbox-in-hierarchy',
  settings: {
    options: RecursiveRecordStrStr
  }
}
export interface StepItemCustomDataNumberWithUnitOfMeasurement{
  mode: '@number-with-unit-of-measurement',
  settings: {
    convertion: string,
    /** Chave da propriedade em que ficará salvo o valor real do componente */
    real_key: string,
    select: {
      key: string,
      options: Array<{
        name: string,
        value: string,
        scale: number
      }>,
      placeholder?: string
    },
    converted: { key: string }
  }
}
export interface StepItemCustomJson{
  mode: '@json',
  settings: { hidden?: boolean }
}