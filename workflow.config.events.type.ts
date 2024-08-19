import { CreateScheduleEvent } from "./schedule.type"
import { WorkflowNotificationEffectType } from "./workflow.config.type"

//#region CALENDAR EVENTS
export interface WFCalendarMultipleType{
  /** Id da posição em que se encontra o array */
  id: string,
  /** Condição para que cada nó seja considerado válido */
  condition?: string,
  /** Valor que será concatenado ao id do flowData quando no external_id do evento */
  external_id: string
}
export interface WFCalendarEventType {
  effects?: Array<WorkflowNotificationEffectType>,
  multiple?: WFCalendarMultipleType,
  appointment: WFCalendarEventAppointment
}
export interface WFCalendarEventAppointment extends Omit<CreateScheduleEvent, 'start' | 'end' | 'email' | 'guests' | 'tags'>{
  /** Caminho da data no flowData.data */
  start: string,
  /** Caminho da data no flowData.data */
  end?: string,
  /** Com suporte a shortcodes \@[] */
  tags?: string[],
  guests: {
    /**
     * Usuários a serem incluídos, podendo usar as mesmas regras de \
     * workflow.config.notification
     * - [@data_creator]                Criador do flow data
     * - [@data_owners]                 Responsáveis pelo flow data
     * - [@wf_owner]                    Responsável pelo workflow
     * - [@to:<contact1>[,<contact2>]]  Contato(s) pré-definido(s)
     * - 'path-to-contact'              Caminho para o registro dentro do flow_data.data 
     *                                  que contenha o contato
     */
    owner: string[],
    /**
     * Usuários a serem incluídos, podendo usar as mesmas regras de \
     * workflow.config.notification
     * - [@data_creator]                Criador do flow data
     * - [@data_owners]                 Responsáveis pelo flow data
     * - [@wf_owner]                    Responsável pelo workflow
     * - [@to:<contact1>[,<contact2>]]  Contato(s) pré-definido(s)
     * - 'path-to-contact'              Caminho para o registro dentro do flow_data.data 
     *                                  que contenha o contato
     */
    guest: string[]
  }
}
export interface WFDeleteFromCalendarEventType{
  effects?: Array<WorkflowNotificationEffectType>,
  multiple?: WFCalendarMultipleType,
  /**
   * Utilizado apenas quando não usar a prop multiple, e o external_id do flowData com o evento \
   * for formado pela concatenação(com #) do flow_data_id(padrão) + algum valor dinâmico
   */
  single_external_id?: string
}
//#endregion CALENDAR EVENTS
export interface ReplicateFlowDataRelateType{
  id: string,
  /**
   * Por padrão a referência trará o _id
   */
  resume?: Record<string, string>
}
export interface ReplicateFlowDataEffectType{
  condition?: string,
  breakExec?: boolean,
  replace: Record<string, any>
}
export interface ReplicateFlowDataType{
  /**
   * Adicionar explicitamente a regra de replicação, Para usá-lo preencha a prop e \
   * adicione ```_inner_data``` na ```ref```.
   **/
  inner_data?: Record<string, any>[],
  /** Campo referência para replicação */
  ref: string,
  /** { 'campo-replicado': 'destino-do-campo' } */
  replace: Record<string, string>
  effects?: ReplicateFlowDataEffectType[],
  /**
   * Relacionar replicações. Essa funcionalidade irá colocar \
   * ponteiros de referência em cada uma das replicações para \
   * se referênciar as demais
   */
  relate?: ReplicateFlowDataRelateType
}
export interface ConsolidateFlowDataEventType{
  query?: any,
  /** referência dos campos de associação */
  match: string[],
  /** tratamentos possíveis para lidar com o merge */
  merge: Array<{
    /** strc baseado no registro novo */
    condition?: string,
    rightCondition?: string,
    leftCondition?: string,
    /**
     * (default: left-join)
     * 
     * Qual será o registro usado como base.
     * - Left: encontrado no banco através do match
     * - Right: registro atual
     */
    mode?: 'left-join' | 'right-join'
    /**
     * Campos que serão mesclados. Se refere ao registro oposto \
     * ao que está sendo utilizado como base no [mode]
     * - overwrite = sobrescreve o campo
     * - merge:array = força a união gerar um array
     * - merge:unique = faz a união de dois arrays e garante que os valores sejam unicos
     **/
    join: Record<string, 'overwrite' | 'merge:array' | 'merge:unique'>,
    /** Se for true interrompe a execução após match */
    breakExec?: boolean
  }>,
  effects?: Array<{
    condition?: string,
    append_values: Record<string, any>
  }>
}
export interface ToAffectFlowDataEventType{
  query?: Record<string, {
    type: 'in' | 'nin' | 'not' | 'text' | 'eq' | 'lte',
    /** REF */
    value: any,
    /** Se for true, o value será um valor direto e não uma referência. */
    static?: boolean
  }>,
  effects: {
    condition?: string,
    append_values?: Record<string, any>,
    /** Forçar o disparo de uma trigger */
    trigger_event?: {
      /** Primeiro parâmetro de match para localizar o evento */
      name: string,
      /** Fazer match por condição */
      find_by_condition?: string
    }
  }[],
  effects_on_this?: {
    condition?: string,
    /** always (default) */
    only?: 'always' | 'success' | 'fail',
    append_values: Record<string, any>
  }[]
}