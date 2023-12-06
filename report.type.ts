import { StepItemType } from "./step.item.field.type"
import { StepViewType } from "./step.item.view.type"
import { WorkflowConfigFilterType } from "./workflow.config.type"

export interface ReportType{
  _id: string,
  title: string,
  description: string,
  /** URL de download de um report estático */
  url?: string,
  analytics?: {
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
    searchs: Array<{
      request: 'flow_datas' | 'flow_entities',
      /**
       * - Caso request = flow_datas, o target_ids = [wf_id],
       * - Caso request = flow_entities, o target_ids = [wf_ids, entity_key]
       */
      target_ids: string[],
      /** Record<coluna-na-planilha,path-na-resposta> */
      columns: Record<string, string>,
      queries?: Array<{
        /** strc */
        condition?: string,
        /**
         * Se a query for aplicada, caso break = true, ele para o \
         * loop em queries
         */
        break?: boolean,
        query: Record<string, string> | Record<string, {
          /** SEM SUPORTE A STRC */
          type: WorkflowConfigFilterType['type'],
          value: any
        }>
      }>
      /**
       * Se for utilizado, fará a desestruturação do array referênciado e o \
       * columns agirá em função dos dados desestruturados que agora serão \
       * a raiz do objeto.
       * 
       * ! Ainda não há suporte para mais de uma referência cumulativa !
       */
      cumulative?: string[]
    }>
  },
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
}