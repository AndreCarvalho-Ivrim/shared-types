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
    matchs?: Array<{ condition: string, name: string }>,
    ref?: string,
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
    /**
     * OPCIONAL - propriedade só é valida quando mode é igual a FlowEntityData: Id da entidade. \
     * Caso seja uma entidade fora do workflow, usar a notação ```flow-id#entity-key```.
     **/
    entity_key?: string,
    /**
     * Todas propriedades tem o data. adicionado automaticamente, então use o \@id = _id e \@current_step = current_step_id,\
     * caso queira acessar essas propriedades.
     **/
    query?: any,
    /** 
     * Record<chave-na-entidade-dinamica, (valor-estatico | \@[shortcode] | \@code_helper)>
     * 
     * Se adicionar ? no final da 'chave-na-entidade-dinamica', o dado só será inserido caso seja \
     * válido.
     */
    append_values?: Record<string, any>,
    conditional_append_values?: {
      /**
       * Para se referenciar os parametros passados, utilize o prefixo ```_params.```, \
       * exemplo: ```_params.id```
       */
      condition?: string,
      append_values: Record<string, any>,
      /**
       * Caso essa propriedade esteja marcada como true, quando uma condição der match, ela \
       * interromperá o loop, caso contrário, continuará executando as próximas condições \
       * e incrementando os valores 
       **/
      breakExec?: boolean
    }[]
  }
}

export type WorkflowTriggerType = WorkflowTriggerSyncFlowDatas | WorkflowTriggerGamificationActionLog | WorkflowTriggerObserverEvents | WorkflowTriggerUpdateFlowEntityData | WorkflowTriggerUpdateFlowData;

export type WorkflowFlowComments = { mode: 'comments' };
export type WorkflowFlowChat = {
  mode: 'chat',
  /**
   * É a ref de uma propriedade do flow-data utilizada para montar \
   * o título da página externa do ivrim notes
   */
  identifier: string,
  /**
   * Permite enviar mensagens a partir de uma página publica \
   */
  external_email?: boolean,
  permissions?: {
    /** Rotas onde será possivel abrir chat e manda mensagem */
    steps_open_chats: 'all' | string[],
    /** Permite ver os chats de outros usuários */
    view_all_chats: 'all' | 'all-with-permissions' | string[],
    /** Permite abrir novos chats com usuários da empresa */
    open_chats: 'all' | 'all-with-permissions' | string[],
    /**
     * Permite navegar entre os chats em que está incluso, quando está \
     * na página externa.
     * 
     * - all: todos podem ver a sidebar
     * - all-with-permissions: apenas usuários com permissão no fluxo
     * - string[]: apenas permissões selecionadas
     */
    sidebar_on_external_page: 'all' | 'all-with-permissions' | string[],
    /**
     * Opção complementar ao open_chats \
     * 
     * O usuario só terá permissão caso passe em algum condicional \
     * disponível: $_user_id
     */
    switch_condition?: string[]
  }
};

export type WorkflowIvrimNotes = WorkflowFlowComments | WorkflowFlowChat;