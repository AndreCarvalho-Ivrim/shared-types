import { AvailableCustomItemModeType, ThemeColorType } from "./step.item.field.type";
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
export type AvailableStepItemViewTypeType = 'table' | 'group-table' | 'horizontal-table' | 'description' | 'html' | 'redirect' | 'list' | 'markdown' | 'tasks';
export const availableStepItemViewTypeFormatted : Record<AvailableStepItemViewTypeType, string> = {
  table: 'Tabela',
  'group-table': 'Grupo de Tabelas',
  'horizontal-table': 'Tabela Horizontal',
  description: 'Descrição',
  html: 'Conteúdo Customizado',
  redirect: 'Redirecionamento',
  list: 'Lista',
  markdown: 'Markdown',
  tasks: 'Tarefas'
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
  type: IntegrationExcelColumnTypeType | 'file-multiple' | 'file' |  AvailableCustomItemModeType,
  /**
   * Serve para fazer correspondência entre valores, exemplo, em um campo boolean:
   * 
   * 'true': 'Ativo' \
   * 'false': 'Inativo' \
   * '_default': 'Tradução caso nenhuma opção anterior dê match'
   */
  translate?: Record<string, string>,
  condition?: string,
  required?: boolean,
  permission_to_view?: string
}
export type StepViewType = StepViewTableType | StepViewGroupTableType | StepViewHorizontalTableType | StepViewTasksType | StepViewDescriptionOrHtmlType | StepViewRedirectType | StepViewListType | StepViewMarkdownType;
export interface StepViewTableType extends StepViewBaseType{
  type: 'table',
  columns: StepViewColumnType[]
}
export interface StepViewGroupTableType extends StepViewBaseType{
  id: string,
  type: 'group-table',
  resume: StepViewColumnType[],
  columns: StepViewColumnType[],
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
export type StepViewAttrMaskType = 'none' | 'alert-danger' | 'alert-warning' | 'alert-info' | 'alert-light' | 'alert-success' | 'progress-bar'
export const stepViewAttrMaskType : Record<StepViewAttrMaskType, string>= {
  'none':          'Sem máscara',
  'alert-danger':  'Alerta Perigo (Vermelho)',
  'alert-warning': 'Alerta Atenção (Amarelo)',
  'alert-info':    'Alerta Informação (Azul Claro)',
  'alert-light':   'Alerta Leve (Cinza Claro)',
  'alert-success': 'Alerta Sucesso (Verde)',
  'progress-bar':  'Barra de Progresso'
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
   * Para utilizar a mascara de progress-bar é necessário que no conteúdo tenha \
   * dois números separados por virgula(,)
   */
  mask?: StepViewAttrMaskType,
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
}
export interface StepViewMarkdownType extends StepViewBaseType{
  type: 'markdown',
  url: string
}