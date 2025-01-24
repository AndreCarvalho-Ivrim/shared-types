export type AvailableTriggerEffects = 'onload-to-fill-the-page-if-necessary' | 'refresh-flow-datas' | 'success-message' | 'clear-flow-entity-cache'
interface WorkflowTriggerBase{
  /** Referência interna */
  id: string,
  title: string,
  /** Se o evento será feito em segundo plano ou se terá resposta imediata */
  is_async: boolean,
  /**
   * Effects só são válidos quando ``` is_async = false ```
   * 
   * ```{ "onload-to-fill-the-page-if-necessary": true }``` \
   * Atualizar dados da visualização, se não tiver com a tabela preenchida
   * 
   * ```{ "refresh-flow-datas": { "condition": "--string-conditional--"} | true  } ```
   * Recarregar dados da visualização
   * 
   * ```
   *  {
   *    // Todos valores visualizados nessa função estão dentro do resultAndResponse.data
   *    "success-message": {
   *      // -- opcional
   *      "condition": "--string-conditional--",
   *      // Tem suporte a valores dinâmicos da resposta com \@[]
   *      "response": ["--se-verdadeiro--", "--se-falso--"],
   *    }
   *  }
   * ```
   * Formatar a mensagem de resposta
   */
  effects?: Partial<Record<AvailableTriggerEffects, boolean | {
    condition: string,
    [key: string]: any
  }>>,
}

export interface WorkflowTriggerSyncFlowDatas extends WorkflowTriggerBase{
  /** 
   * Referência ao evento que será disparado:
   * 
   * \@sync-flow-datas: Sincronizar integração de dois workflows
   */
  name: '@sync-flow-datas',
  data: {
    /** id-do-wf-de-destino */
    target_flow_id: string,
    /** Record<"id-from-current-wf", "id-from-target-flow"> */
    match: Record<string, string>,
    replacers: Record<string, string>
  }
}
export interface WorkflowTriggerGamificationActionLog extends WorkflowTriggerBase{
  /** 
   * Referência ao evento que será disparado:
   * 
   * \@gamification-action-log: Lidar com logs de ação em gamificação
   */
  name: '@gamification-action-log',
  data: any
}
export interface WorkflowTriggerObserverEvents extends WorkflowTriggerBase{
  /** 
   * Referência ao evento que será disparado:
   *
   * \@observer-event: Dispara N eventos do observer apontando a condition
   */
  name: '@observer-events',
  /** Adicione as condicionais dos eventos do observer que quer disparar */
  data: {
    matchs: Array<{ condition: string, name: string }>
  } 
}
export interface WorkflowTriggerUpdateFlowEntityData extends  WorkflowTriggerBase{
  /** 
   * Referência ao evento que será disparado:
   *
   * \@update-flow-entity-data: Gera uma atualização no flowEntityData
   */
  name: '@update-flow-entity-data' | '@create-flow-entity-data',
  data: {
    /** Id da entidade. Caso seja uma entidade fora do workflow, usar a notação ```flow-id#entity-key``` */
    entity_key: string,
    query?: any,
    /** 
     * Record<chave-na-entidade-dinamica, (valor-estatico | \@[shortcode] | \@code_helper)>
     */
    append_values: Record<string, any>
  }
}
export interface WorkflowTriggerUpdateFlowData extends  WorkflowTriggerBase{
  /** 
   * Referência ao evento que será disparado:
   *
   * \@update-flow-entity-data: Gera uma atualização no flowData
   */
  name: '@update-flow-data',
  data: {
    /** Id da entidade. Caso seja uma entidade fora do workflow, usar a notação ```flow-id#entity-key``` */
    entity_key: string,
    query?: any,
    /** 
     * Record<chave-na-entidade-dinamica, (valor-estatico | \@[shortcode] | \@code_helper)>
     */
    append_values: Record<string, any>
  }
}

export type WorkflowTriggerType = WorkflowTriggerSyncFlowDatas | WorkflowTriggerGamificationActionLog | WorkflowTriggerObserverEvents | WorkflowTriggerUpdateFlowEntityData | WorkflowTriggerUpdateFlowData;