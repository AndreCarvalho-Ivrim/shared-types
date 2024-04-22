import { StepItemType } from "./step.item.field.type"
import { StepViewType } from "./step.item.view.type"
import { WorkflowConfigFilterType } from "./workflow.config.type"

export type ReportFormatTypes = 'date' | 'datetime' | 'money' | 'text' | 'boolean' | '@user(name)' | '@user(email)'
export interface ReportAnalyticsSearchType{
  request: 'flow_datas' | 'flow_entities',
  /**
   * - Caso request = flow_datas, o target_ids = [wf_id],
   * - Caso request = flow_entities, o target_ids = [wf_id, entity_key]
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
  queries?: Array<{
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
  }>
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
  cumulative?: string[]
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
  format?: Record<string, {
    type: ReportFormatTypes,
    translate?: Record<string, string>
  }>,
  /** default: csv */
  convert_to?: 'csv' | 'xlsx'
}
export interface ReportType{
  _id: string,
  title: string,
  description: string,
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

  client_id: string;
  user_id: string;  
  created_at: Date;
  updated_at: Date;
}
export interface ShortReportType{
  _id: string,
  title: string,
  description: string,
  /** URL de download de um report estático */
  url?: string,
  analytics?: boolean | ReportAnalyticsType,
  params?: ReportAnalyticsType['params'],
  extension?: 'xlsx' | 'csv'
}