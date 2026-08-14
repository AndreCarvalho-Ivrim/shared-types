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
export type AvailableStepItemViewTypeType = 'table' | 'group-table' | 'horizontal-table' | 'description' | 'html' | 'redirect' | 'list' | 'markdown' | 'tasks' | 'timeline' | 'group-views' | 'checklist' | 'exception' | 'thumbnail';
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
  timeline: 'Timeline',
  'group-views': 'Grupo de Itens',
  checklist: 'Checklist',
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
export type StepViewType = StepViewTableType | StepViewGroupTableType | StepViewHorizontalTableType | StepViewTasksType | StepViewTimelineType | StepViewGroupViewsType | StepViewChecklistType | StepViewDescriptionOrHtmlType | StepViewRedirectType | StepViewListType | StepViewMarkdownType | StepViewExceptionType | StepViewThumbnailType;
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
  /** Id dentro do array referenciando o vencimento da tarefa */
  expiration: string,
  step_id?: string,
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
/**
 * Zona fixa da entrada da timeline(data, responsável, descrição). Mesma ideia \
 * do [identifier]/[avatar] no resume do kanban: aponta para o campo do registro \
 * que alimenta aquela zona, com o rótulo junto.
 **/
export interface StepViewTimelineSlotType{
  /** Id do campo dentro do registro */
  id: string,
  /** Rótulo. Sem ele, o valor é exibido sem título */
  name?: string
}
export interface StepViewTimelineType extends StepViewBaseType{
  type: 'timeline',
  /** Id do array de registros da timeline */
  id: string,
  /**
   * Habilita a adição manual de registros. Quando desabilitado(default), a \
   * timeline é somente leitura, sendo alimentada por observers/exceptions.
   **/
  addable?: boolean,
  /**
   * Etapa que carrega os campos do modal de adição de registros. Os items dela \
   * devem ser prefixados pelo id do array(ex: history_contracts.description). \
   * Sem step_id, a adição usa um campo simples de descrição.
   **/
  step_id?: string,
  /** Data exibida no topo da entrada. default: { id: 'created_at' } */
  date?: StepViewTimelineSlotType,
  /**
   * Responsável pela entrada. O valor do [id] é resolvido para o nome do \
   * usuário. default: { id: 'user_id' }
   **/
  responsible?: StepViewTimelineSlotType,
  /** Texto principal da entrada. default: { id: 'description' } */
  description?: StepViewTimelineSlotType,
  /** Campos adicionais exibidos em cada registro, além de data, responsável e descrição */
  header?: StepViewColumnType[],
  fields?: StepViewColumnType[],
  /** Quantidade de registros exibidos por vez, antes do "Ver mais". default: 3 */
  per_page?: number,
  /**
   * Ordenação dos registros. Quando não informado, ordena pelo campo do slot \
   * [date] de forma decrescente, ou seja, do mais recente para o mais antigo.
   **/
  order_by?: {
    field: string,
    order: 'asc' | 'desc'
  },
  placeholders?: {
    _empty_history?: string,
    _trigger_form?: string,
    description?: string,
  },
  /** Caso for falso, e não tiver nenhum registro e não tiver a prop addable ocultara o elemento */
  required?: boolean
}
/**
 * Agrupa itens sob um único bloco. O [rules.render] é avaliado no próprio \
 * grupo, então os filhos não precisam saber de render condicional — é o que \
 * permite usar o grupo como aba, inclusive com views que não tratam render.
 **/
export interface StepViewGroupViewsType extends StepViewBaseType{
  type: 'group-views',
  views: string[]
}
export interface StepViewChecklistItemType{
  label: string,
  /**
   * Condição que marca o item como concluído. Aceita [$flow_data:] para o \
   * registro salvo e [$] para o que está sendo preenchido em tela.
   **/
  condition: string,
  /** Texto exibido quando pendente. default: Adicionar… */
  action_label?: string
}
export interface StepViewChecklistType extends StepViewBaseType{
  type: 'checklist',
  items: StepViewChecklistItemType[],
  /** Exibe contagem e barra de progresso no topo. default: true */
  show_progress?: boolean
}
export interface StepViewListType extends StepViewBaseType{
  id: string,
  type: 'list',
  required?: boolean
}
export type StepViewAttrMaskType = 'none' | 'alert-danger' | 'alert-warning' | 'alert-info' | 'alert-light' | 'alert-success' | 'progress-bar' | 'code' | 'fieldset';
export const stepViewAttrMaskType : Record<StepViewAttrMaskType, string>= {
  'none':          'Sem máscara',
  'alert-danger':  'Alerta Perigo (Vermelho)',
  'alert-warning': 'Alerta Atenção (Amarelo)',
  'alert-info':    'Alerta Informação (Azul Claro)',
  'alert-light':   'Alerta Leve (Cinza Claro)',
  'alert-success': 'Alerta Sucesso (Verde)',
  'progress-bar':  'Barra de Progresso',
  'code':          'Código',
  'fieldset':      'Separador de Seção'
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
  /**
   * Caso o valor seja um array, adicione o filter_condition para delimitar as repetições
   */
  filter_condition?: string,
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
  }>,
  /** Utilize main_item para acessar valores do item principal \
   * Utilize main_item.is_main_selected para verificar se o item principal foi selecionado \
   */
  alter_main?: {
    condition: string,
    name: string,
    value: string,
    filter_condition?: string
  }
}
export interface IActNotification {
  notify: string,
  /** 
   * Utilizado para definir onde será salvo o item adicionado, editado ou removido \
   * */
  path_to_save?: string,
}
export interface IExceptionWarning {
  condition: string,
  message: string,
  /**
   * Utilizado para fazer a verificação com item adicionado
   */
  added?: boolean
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
    notification?: IActNotification,
    warnings_condition?: IExceptionWarning[]
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
    fn_exception?: string,
    warnings_condition?: IExceptionWarning[]
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
export interface IDataExceptionCallExceptionObservers{
  fn_exception: string,
  get_values?: string[],
  type: ThemeColorType,
  /** 
   * Utilizado para salvar os valores retornado nos campos
   * */
  update_fields?: {
    flow_data_key: string,
    field_key: string,
  }[]
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