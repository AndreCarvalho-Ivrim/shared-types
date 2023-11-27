import { ItemOrViewOrWidgetOrIntegration } from ".";

export type StepItemAttrTypeType = 'text' | 'textarea' | 'select' | 'select-multiple' | 'radio' | 'checkbox' | 'date' | 'file' |  'file-multiple' |  'group-collapse' | 'custom';
export const stepItemAttrTypeFormatted : Record<StepItemAttrTypeType,string> = {
  text: 'Entrada de Texto',
  textarea: 'Entrada de Texto Grande',
  select: 'Entrada de Seleção',
  'select-multiple': 'Entrada de Seleção Multipla',
  radio: 'Caixa de Seleção',
  checkbox: 'Caixa de Multipla Escolha',
  date: 'Date',
  file: 'Upload de Arquivo',
  'file-multiple': 'Upload de Multiplos Arquivos',
  'group-collapse': 'Grupo de Campos Intercalável',
  custom: 'Customizado'
};

export type StepItemAttrMaskType = 'email' | 'number' | 'money' | 'cpf' | 'cnpj' | 'cpf-cnpj' | 'cep' | 'phone';
export type ThemeColorType = 'primary' | 'success' | 'light' | 'danger' | 'warning' | 'info';
export type TargetModeType = 'single' | 'multiple' | 'trigger' | 'final';
export type StepItemModeType = 'field' | 'view' | 'widget' | 'integration';

export interface ValueAndNameStringType{
  value: string,
  name: string
}
export interface StepItemType{
  key: string,
  type: StepItemAttrTypeType,
  mode: 'field',
  mask?: StepItemAttrMaskType,
  label?: string,
  placeholder?: string,
  options?: ValueAndNameStringType[],
  required?: boolean,
  rules?: {
    min?: number,
    max?: number,
    render?: string,
    /**
     * AVAILABLE CUSTOM RULES\n
     * - [ignore]: Irá ignorar o campo na hora de salvar(só existe para controle de layout[geralmente usado em renderização condicional]), ou pesquisar
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
    customRules?: string
  },
  observer?: boolean,
  items?: ItemOrViewOrWidgetOrIntegration[],
  autocomplete?: {
    /** Se iniciar com @ está se referindo alguma função hardcode, e não do WF Entities */
    name: string,
    /**
     * autocomplete.response => field to fill
     * ```
     * interface ToFillOnSelect{
     *   // Valor mostrado na option do select
     *   name: '<path-na-resposta>',
     *   // Valor no value da option do select
     *   value: '<path-na-resposta>',
     *   // Gerar preenchimento em outros campos, com base no selecionar
     *   outhers?: string
     * }
     * ```
     * 
     * O outhers é uma string contendo a posição em que será armazenado : \
     * o caminho dentro da resposta, podendo ter multiplos itens separados por ',' \
     * Exemplo:
     * 
     * ```
     *  "<path-in-flow-data>:<path-in-response>,<outher-path>:<outher-path-in-response>"
     * ```
     */
    toFill?: Record<string, string>,
    trigger?: { mode: 'keyup' } | {
      mode: 'clickToNext',
      target: string
    }
    /** String condition, para filtrar os dados do autocomplete */
    filter_condition?: string,
  },
  customData?: {
    mode: AvailableCustomItemModeType,
    settings?: any
  }
}
export type AvailableCustomItemModeType = '@select-multiple-and-prorating' | '@filter-options';
export const availableCustomItemMode : AvailableCustomItemModeType[] = ['@select-multiple-and-prorating', '@filter-options'];