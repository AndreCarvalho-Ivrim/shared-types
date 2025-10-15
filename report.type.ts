import { StepItemType } from "./step.item.field.type"
import { StepViewType } from "./step.item.view.type"
import { WorkflowConfigFilterType } from "./workflow.config.type"

/** money inclui o tratamento de casas decimais forçando duas casas */
export type ReportFormatTypes = 'date' | 'datetime' | 'money' | 'text' | 'boolean' | '@user(name)' | '@user(email)' | 'number'
export type ReportAnalyticsSearchDynamicColumnType = {
  /**
   * - array-destructuring: Desestruturação de array, irá gerar as colunas dinamicamente, \
   * utilizando a referência de um array, com cada posição do array gerando um conjunto \
   * de colunas.
   **/
  mode: 'array-destructuring',
  /** ID do array p/ desestruturação */
  id: string,
  /**
   * Ambos os parametros são baseados no mode [array-destructuring].
   * 
   * - register-with-more-positions: Irá encontrar o registro onde o array tem o maior \
   * número de posições, e esse registro será utilizado para gerar as colunas.
   * 
   * - first-register: Irá pegar o primeiro registro, e ele será utilizado para gerar as \
   * colunas.
   * 
   */
  generate_columns_with: 'register-with-more-positions' | 'first-register',
  columns: Record<string, string | {
    /**
     * Com acesso as variáveis [curr] que se refere ao item no laço de repetição \
     * e flow_datas, que é o array puro de registros encontrados.
     * 
     * Obs. se o search tiver cumulative, a raiz do flow_data estará na prop old, \
     * ao invés de data.
     */
    condition: string,
    value: string
  }[]>
}
export interface ReportAnalyticsSearchType{
  request: 'flow_datas' | 'flow_entities' | 'fn-exceptions',
  /**
   * - Caso request = flow_datas, o target_ids = [wf_id],
   * - Caso request = flow_entities, o target_ids = [wf_id, entity_key]
   * - Caso request = fn-exceptions, o target_ids [exception]
   */
  target_ids: string[],
  /**
   * Record<coluna-na-planilha,path-na-resposta>
   * 
   * Existe os seguintes shortcodes em path-na-resposta, para pegar dados da raiz do registro
   * - \@id
   * - \@user_id
   * - \@owner_ids
   * - \@created_at
   * - \@updated_at
   * - \@step_id
   * */
  columns: Record<string, string>,
  queries?: ReportAnalyticsSearchQuery[]
  /**
   * Se for utilizado, fará a desestruturação do array referênciado e o \
   * columns agirá em função dos dados desestruturados que agora serão \
   * a raiz do objeto.
   * 
   * Caso seja request = flow_datas, há suporte para o shortcode \@history \
   * para fazer o cumulative no histórico do flow_data.
   * 
   * ! Ainda não há suporte para mais de uma referência cumulativa !
   */
  cumulative?: string[],
  dynamicColumns?: ReportAnalyticsSearchDynamicColumnType[],
  /** Válido quando request = fn-exceptions */
  additional_params?: any
}
export interface ReportAnalyticsSearchQuery{
  /** strc */
  condition?: string,
  /**
   * Se a query for aplicada, caso break = true, ele para o \
   * loop em queries
   */
  break?: boolean,
  /**
   * Use os shortcodes a seguir para referências dados não dinâmicos(fora do data do flowData, \
   * ou dados gerados automaticamente no flowEntity) de um registro:
   * 
   *  - \@created_at : data de criação
   *  - \@step_id : current_step_id
   */
  query: Record<string, string | {
    type: WorkflowConfigFilterType['type'],
    value: any
  }>
}
export interface ReportAnalyticsFormatAndOrTranslate{
  type: ReportFormatTypes,
  translate?: Record<string, string>,
  defaultValue?: any
}
export interface ReportAnalyticsType{
  /**
   * Comportamento na agregação de valores quando existe mais de \
   * um search. Padrão 'append'
   */
  mode?: 'append' | 'merge',
  /**
   * São as chaves que serão utilizadas para fazer o merge \
   * das múltiplas respostas. As chaves são valores existentes \
   * nas colunas.
   * 
   * Obrigatório quando mode = 'merge'
   */
  match_keys?: string[],
  /** 
   * As colunas mencionadas serão excluidas da criação da planilha \
   * após todos os processos de agregação das linhas
   */
  ignore_columns?: string[],
  order_by?: Record<string, 'asc' | 'desc'>,
  params?: (StepItemType | StepViewType)[],
  searchs: Array<ReportAnalyticsSearchType>,
  format?: Record<string, ReportAnalyticsFormatAndOrTranslate>,
  /** default: csv */
  convert_to?: 'csv' | 'xlsx'
}
export type ReportPermissionMode = 'selected' | 'user-category';
export interface ReportType{
  _id: string,
  title: string,
  description: string,
  obs?: string | null,
  /** URL de download de um report estático */
  url?: string,
  analytics?: ReportAnalyticsType,
  /**
   * INDISPONÍVEL:
   * 
   * Está funcionalidade irá criar uma rotina de geração de relatório \
   * fazendo com que os usuários que solicitarem os relatórios só \
   * solicitem os dados já gerados, e não gere em tempo real.
   */
  routines?: {
    /** 
     * INDISPONÍVEL:
     *
     * Assim que uma rotina de criação for finalizada, caso o webhook esteja \
     * configurado, ele irá disparar este relatório para o lugar de destino.
     */
    webhook?: any,
    [key: string]: any
  }
  permissions?: {
    mode: ReportPermissionMode,
    allowed: string[]
  }
  client_id: string;
  user_id: string;  
  created_at: Date;
  updated_at: Date;
}
export interface ShortReportType{
  _id: string,
  title: string,
  description: string,
  obs?: string,
  /** URL de download de um report estático */
  url?: string,
  analytics?: boolean | ReportAnalyticsType,
  params?: ReportAnalyticsType['params'],
  extension?: 'xlsx' | 'csv',
  permissions?: ReportType['permissions']
}