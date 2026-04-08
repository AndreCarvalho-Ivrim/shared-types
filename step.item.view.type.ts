import { ColumnBadgeType, ItemOrViewOrWidgetOrIntegration, StepActionConfirmType } from "../types";
import { AvailableIcons } from "./icon.type";
import { AvailableCustomItemModeType, StepItemAttrMaskType, StepItemAttrTypeType, ThemeColorType } from "./step.item.field.type";
import { IntegrationExcelColumnTypeType } from "./step.item.integration.type";

interface StepViewBaseType{
  key: string,
  mode: 'view',
  label?: string,
  /** Título que será renderizado na tabela */
  placeholder?: string,
  /** Só funciona se houver o placeholder(titulo) */
  is_collapsed?: boolean ,
  rules?: {
    render?: string,
  }
}
export type AvailableStepItemViewTypeType = 'table' | 'group-table' | 'horizontal-table' | 'description' | 'html' | 'redirect' | 'list' | 'markdown' | 'tasks' | 'exception' | 'thumbnail';
export const availableStepItemViewTypeFormatted : Record<AvailableStepItemViewTypeType, string> = {
  description: 'Descrição',
  table: 'Tabela',
  'group-table': 'Grupo de Tabelas',
  'horizontal-table': 'Tabela Horizontal',
  list: 'Lista',
  redirect: 'Redirecionamento',
  markdown: 'Markdown',
  html: 'Conteúdo Customizado',
  tasks: 'Tarefas',
  exception: 'Exceção',
  thumbnail: 'Thumbnail'
};
export interface StepViewColumnType{
  /** 
   * ID com shortcodes para replace \
   * Exemplo: \
   * ```
   * id_1 = 8 | id_2 = 10
   * 
   * definição: \@[id_1]/@[id_2]
   * resultado: 8/10
   * 
   * Também pode ser definido um valor padrão usando pipe(|)
   * id_1 = undefined | id_2 = 10
   * 
   * definição: \@[id_1|0]/@[id_2] 
   * resultado: 0/10
   * ```
   * 
   * Também podem ser utilizados codehelpers, como:
   * 
   * - \@days-to-now:id: Aponta para uma data e faz o calculo de quantos dias se passaram dessa data
   * 
   */
  id: string, 
  name: string,
  /**
   * Caso use o \@link, o id será o link de redirecionamento, e caso precise de configurações a mais \
   * utilize a propriedade data.
   * 
   * Caso a url esteja no conteúdo da referência, deve utilizar o \@redirect-to
   */
  type: IntegrationExcelColumnTypeType | 'file-multiple' | 'file' |  AvailableCustomItemModeType | 'group',
  /**
   * Serve para fazer correspondência entre valores, exemplo, em um campo boolean:
   * 
   * 'true': 'Ativo' \
   * 'false': 'Inativo' \
   * '_default': 'Tradução caso nenhuma opção anterior dê match'
   */
  translate?: Record<string, string>,
  badge?: ColumnBadgeType,
  condition?: string,
  required?: boolean,
  permission_to_view?: string,
  /**
   * Caso type \@link, você pode preencher as configurações a seguir:
   * ```
   *  {
   *    // default: _blank
   *    target?: '_blank' | '_self'
   *    // texto do botão, default: Acessar
   *    text?: string
   *  }
   * ```
   */
  data?: any
}
export type StepViewType = StepViewTableType | StepViewGroupTableType | StepViewHorizontalTableType | StepViewTasksType | StepViewDescriptionOrHtmlType | StepViewRedirectType | StepViewListType | StepViewMarkdownType | StepViewExceptionType | StepViewThumbnailType;
export type AdditionalTablesType = {
  label: string,
  columns: StepViewColumnType[],
}
export interface StepViewTableType extends StepViewBaseType{
  type: 'table',
  columns: (StepViewColumnType | StepViewColumnGroupType)[],
  additionalTables?: AdditionalTablesType[]
  arrayTable?: {
    /** Id do array de objects */
    id: string,
    /**
     * Condicional para validar se uma posição do array será renderizado ou não. Observações:
     * - Use [$flow_data:] para mencionar dados que estão no flow-data
     * - Use [$] para acessar dados que estão sendo observados no formulário
     * - Use [$this.] para acessar dados do laço atual
     **/
    condition?: string
  }
}
export interface StepViewColumnGroupType extends Omit<StepViewColumnType, 'type'>{
  type: 'group',
  columns: StepViewColumnType[]
}
export interface StepViewGroupTableType extends StepViewBaseType{
  id: string,
  type: 'group-table',
  resume: StepViewColumnType[],
  columns: (StepViewColumnType | StepViewColumnGroupType)[],
  required?: boolean
}
export interface StepViewHorizontalTableType extends Omit<StepViewGroupTableType, "type" > {
  type: 'horizontal-table',
  split_table?: number,
  /** true (default) */
  has_pagination?: boolean,
  default_requirements?: {
    /** Dados que espero na visualização */
    data: any[],
    /** Quais propriedades será realizado o match */
    matchs: string[]
  },
  order_by?: {
    field: string,
    order: 'asc' | 'desc'
  }
  filter?: { condition: string }
}
export interface StepViewTasksType extends StepViewBaseType{
  /**
   * Para funcionamento correto do item view-tasks, é obrigatório adicionar um id único, \
   * podendo ser adicionado manualmente, ou pelo observer.append usando o helper uuid
   **/
  type: 'tasks',
  /** Id do array de tarefas */
  id: string,
  /** Id dentro do arrey referenciando o vencimento da tarefa */
  expiration: string,
  resume: StepViewColumnType[],
  columns: StepViewColumnType[],
  /**
   * É necessário ter um status configurado como default para iniciar os \
   * registros, e pelo menos um com type = success para finalizar a tarefa
   */
  status: {
    name: string,
    type: ThemeColorType,
    is_default?: boolean
  }[]
  /** Se for required vai mostrar o item mesmo que não haja tasks */
  required?: boolean
}
export interface StepViewListType extends StepViewBaseType{
  id: string,
  type: 'list',
  required?: boolean
}
export type StepViewAttrMaskType = 'none' | 'alert-danger' | 'alert-warning' | 'alert-info' | 'alert-light' | 'alert-success' | 'progress-bar' | 'code';
export const stepViewAttrMaskType : Record<StepViewAttrMaskType, string>= {
  'none':          'Sem máscara',
  'alert-danger':  'Alerta Perigo (Vermelho)',
  'alert-warning': 'Alerta Atenção (Amarelo)',
  'alert-info':    'Alerta Informação (Azul Claro)',
  'alert-light':   'Alerta Leve (Cinza Claro)',
  'alert-success': 'Alerta Sucesso (Verde)',
  'progress-bar':  'Barra de Progresso',
  'code':          'Código'
}

export interface StepViewDescriptionOrHtmlType extends StepViewBaseType{
  type: 'description' | 'html',
  /**
   * É possível adicionar conteúdo dinâmico utilizando os [replacers] e \
   * no meio do [content] usar o shortcode \@[id-do-variável]
   */
  content: string,
  /** Utilize o id p/ lidar com repetição */
  id?: string,
  replacers?: string[],
  /**
  * Filter so é utilizado quando informado o id do array
  */
  filter?: string,
  /**
   * Para utilizar a mascara de progress-bar é necessário que no conteúdo tenha \
   * dois números separados por virgula(,)
   */
  mask?: StepViewAttrMaskType,
  condition_mask?: {
    type: StepViewAttrMaskType,
    condition: string
  }[],
  rules?: {
    /** 
     * STRING CONDITIONAL
     * 
     * É um formato de escrita, separado com ponto e virgula(;) com o primeiro caracter sendo o
     * marcador que identificam a função de cada parte da string
     * 
     *   \$ -> Para acessar uma propriedade \
     *   \# -> Operador de comparação \
     *   \* -> Valor \
     *   \& -> Operador lógico
     * 
     * Alguns helpers que temos:
     * - Podemos acessar sub propriedades utilizando ponto (.)
     * - Podemos utilizar dois exclamações (!!) para verificar se um campo é verdadeiro('$prop;#eq;*!!') 
     * 
     * Exemprulesrulesruleslo:
     * ```
     *  const data = {
     *    helo: { world: 'by Ivrim' }
     *  }
     * 
     *  // Esse código irá acessar o caminho dentro do objeto, e verificar se o conteúdo é igual ao valor especificado
     *  const stringConditional = '$hello.world;#eq;*by Ivrim'  
     * ```
     * Consultar mais em: shared-types/utils/check-string-conditional.ts
     */
    render?: string,
    has_codehelpers?: boolean
  }
}
export interface StepViewRedirectType extends StepViewBaseType{
  type: 'redirect',
  /**
   * Adicione o id se deseja delimitar um escopo. O componente StepViewRedirect \
   * suporta objetos, ou arrays(neste caso, gerando replicações de si mesmo)
   */
  id?: string,
  resume: StepViewColumnType[],
  /** 
   * Se o [to] começar com @hub: ou @isac: será usada a função \
   * handleRegexUrl para lidar com o endereço de redirecionamento \
   * no caso contrário, será considerado que é o id de outro flowData \
   * e fará a transição interna, alterando apenas o SlideOver ou página
   */ 
  to: string,
  rules?: {
    /** STRING-CONDITIONAL */
    render?: string
  }
  /** Icone de redirecionamento. Default = ChevronDownIcon.-rotate-90 */
  icon?: AvailableIcons,
  /** Default = medium (medium = py-4 | small = py-2) */
  size?: 'medium' | 'small'
}
export interface StepViewMarkdownType extends StepViewBaseType{
  type: 'markdown',
  url: string
}
export interface AvailableColumnsBadgeOption {
  value: string,
  color: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'indigo',
}
export interface AvailableColumnsApproverControlType {
  key: string,
  label: string,
  type: StepItemAttrTypeType,
  mask?: StepItemAttrMaskType,
  required?: boolean,
  badge?: AvailableColumnsBadgeOption[]
}
export interface StepActionApproverControlType {
  label: string,
  type: ThemeColorType,
  key: string,
  icon?: AvailableIcons,
  target_exception: string,
  /** Utilizado para verificar se tem acesso ao botão \
   * Propriedades reservadas: \@group-permission, \@user-permission
   */
  condition?: string,
  isRedirect?: boolean,
  confirm?: StepActionConfirmType,
  append_values?: Record<string, {
    value: any
  }>
}
export interface IActNotification {
  notify: string,
  /** 
   * Utilizado para definir onde será salvo o item adicionado, editado ou removido \
   * */
  path_to_save?: string,
}
export interface IDataExceptionApproverControl{
  /** Propriedade utilizada para controle de aprovadores */
  ref: string,
  /** Itens do modal a serem preenchidos */
  items?: ItemOrViewOrWidgetOrIntegration[],
  /** 
   * Utilizado para definir os valores do header e body \
   * Caso o não utlizado será definido pelo items*/
  render_items?: AvailableColumnsApproverControlType[],
  /** 
   * Utilizado para definir quem pode adicionar e editar
   * */
  add_approvers?: {
    type: '@group-permission',
    permission: string | string[],
    condition?: string,
    /** 
    * Utilizado para realizar o salvamento dos dados adicionados ou editados
    * */
    fn_exception?: string,
    notification?: IActNotification
  },
  edit_approvers?: boolean,
  /**
   * Utilizado para definir quem pode remover
   * */
  remove_approvers?: {
    type: '@group-permission',
    permission: string | string[],
    condition?: string,
    /** 
    * Utilizado para realizar o salvamento dos dados removidos
    **/
    fn_exception?: string
  },
  /**
   * Se tiver items do tipo select-multiple ou select, essas opções será usada para não permitir selecionar a mesma opção caso já selecionada
   **/
  not_repeat_option?: boolean,
  actions?: StepActionApproverControlType[],
  /** 
   * Utilizado para filtrar as fichas \
   * Propriedades reservadas: \@group-permission, \@user-permission
   * */
  filters?: {
    condition: string,
    filter_condition?: string,
    break?: boolean
  }[],
  /** 
   * Utilizado para definir quem e o aprovador principal \
   * Propriedades reservadas: \@group-permission, \@user-permission
   * */
  main_approver?: {
    key: string,
    label: string,
    /** 
     * Utilizado para se tem acesso a funcionalidade
     * */
    condition?: string,
    /** 
   * Utilizado para fazer uma request em uma fnException
   * */
    fn_exception?: string,
    /** 
   * Utilizado para salvar o main no flowData
   * */
    path?: string,
    /** 
   * Utilizado desabilitar a edição
   * */
    disabled?: string
  }
}
export interface StepViewExceptionType extends StepViewBaseType{
  type: 'exception',
  customCSS?: any,
  /** 
   * Parametros adicionais para a exception \
   * Para controle de aprovadores utilize a paramentrização IDataExceptionApproverControl
   * */
  data?: any,
  exception: string
}

export interface StepViewThumbnailType extends StepViewBaseType{
  type: 'thumbnail',
  url: string,
  /** Texto alternativo da imagem */
  alt_text?: string,
}