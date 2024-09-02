import { ExternalRequestSchema, FlowEntitySchemaInfo, FlowEntitySubSchema, IntegrationExcelColumnTypeType, PermissionType, StepActionConfirmType, StepItemAttrMaskType, StepItemType, StepSlaType, StepViewTasksType, ThemeColorType } from "."
import { AvailableIcons } from "./icon.type";
import { WorkflowConfigRulesType } from "./workflow.config.rules.type";

export type AvailableServicesType = 'email' | 'whatsapp' | 'sms' | 'chatbot' | 'omie' | 'rds_marketing';
export type AvailableViewModeType = 'table' | 'dashboard';
export type WorkflowConfigFilterRefType = '@user.name' | '@user.email' | '@owner.name' | '@owner.email' | '@created_at' | '@step_id' | string
export interface WorkflowConfigFilterType {
  name: string,
  /**
   * - text: Pesquisa case incesitive por aproximação (includes)
   * - select: Pesquisa por palavra exata (===)
   * - not: Não é a palavra exata (oposto de select [!==])
   * - date: Comparação por range de data (startDate, endDate)
   * - date-in: Oposto do anterior, é passado apenas 1 data, e deve ter duas refs \
   * onde a primeira é data inicial e a segunda afinal, e a verificação testa se a \
   * data passada está dentro do range do banco
   * - list: Lista de opções (in)
   * - not-list: Não está na lista de opções (nin)
   */
  type: 'text' | 'select' | 'not' | 'date' | 'list' | 'not-list' | 'strc' | 'date-in',
  /** Veja a tipagem de WorkflowConfigFilterRefType para ver opções pré-definidas */
  ref: WorkflowConfigFilterRefType | WorkflowConfigFilterRefType[],
  options?: string[] | { value: string, name: string }[],
  /** somente autocomplete.mode = 'distinct' */
  autocomplete?: string,
  /**
   * Valor inicial de um filtro. Valores pré-definidos:
   * 
   * - \@last-few-months-until-today:{N}: Caso esteja usando o type=date você pode usar este \
   * default value para pegar um range de data de {N}(substituir por um número) meses atrás \
   * até o dia atual.
   * - \@now: Caso esteja usando o type=date você pode usar este default value para pegar a \
   *  data atual.
   */
  defaultValue?: any
}
export interface WorkflowNotificationEffectType{
  /**
   * Efeito aplicado após envio:
   * - always(default): Sempre
   * - success: Apenas se bem sucedido
   * - error: Apenas se falhar
   */
  only?: "always" | "success" | "error",
  condition?: string,
  /** { ['flow-data-key']: \<value-to-add> } */
  append_values: Record<string, any>
}
export interface WorkflowConfigNotificationType {
  name: string,
  condition: string,
  /**
   * Caso não tenha um template personalizado, você pode usar o \
   * \@default-notification, criado o corpo pelo parametro description \
   * e inserindo shortcodes dentro dele para pegar dados personalizado \
   * dos replacers.
   */
  template_id: string,
  type: 'email' | 'message',
  params: Record<string, string>,
  replacers: Record<string, string | {
    codition?: string,
    value: string,
    static?: boolean
  }[]>,
  /** Anexo, com suporte a separado por virgula para referênciar mais de uma fonte de anexo */
  attachment?: string,
  /** Propriedade auxiliar a attachment. Com ela você faz o apontamento para o local onde terá os nomes dos anexos */
  attachment_names?: string,
  /**
   * - [@data_creator]                  Criador do flow data
   * - [@data_owners]                   Responsáveis pelo flow data
   * - [@wf_owner]                      Responsável pelo workflow
   * - [@group-permission:<N>[<N>,...]] Apontar para usuários com base na(s) permissão(ões) do wf
   * - [@to:<contact1>[,<contact2>]]    Contato(s) pré-definido(s)
   * - 'path-to-contact'                Caminho para o registro dentro do flow_data.data que contenha 
   *                                    o contato
   */
  target: '@data_creator' | '@data_owner' | '@wf_owner' | '@group-permission:<N>' | string,
  default_target?: string[],
  effects?: Array<WorkflowNotificationEffectType>
}
export interface WorkflowConfigAutocomplete {
  name: string,
  mode: 'distinct' | 'search',
  ref: string,
  response?: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>,
}
export interface WfConfigObserverBackupData{
  mode: 'create' | 'create-or-update' | 'update',
  /** Obrigatório se mode = 'create-or-update' | 'update' */
  matchs?: string[],
  /**
   * Válido apenas se houver matchs
   * - replace-all(default): substitui todos os valores
   * - replace-if-truth: só substitui os valores válidos
   */
  conflit?: 'replace-all' | 'replace-if-truth',
  /** Efeito colateral no flowData */
  effects?: {
    /** Efeito considerado apenas em caso de (sucesso, erro ou sempre respectivamente) */
    only: 'success' | 'error' | 'always',
    condition?: string,
    /** Valores que serão atualizados no flowData */
    values: Record<string, any>,
    /** Interromper os efeitos colaterais assim que o primeiro der match no condition */
    breakExec?: boolean
  }[]

}
export interface FlowNetworkParams {
  flow_id: string,
  /** 
   * ``` { [data_id]: [target_id] } ``` 
   * Se usar a notação ``` { ".": "." } ```, ou qualquer variação disso, estará fazendo \
   * referência a raiz do objeto (no caso o flowData.data)
   */
  match: Record<string, string>,
  /** Adicionar um valor no registro de destino */
  append_values?: Record<string, {
    value: any
  }>,
  /** 
   * [by-step]: irá usar a validação de um step(do target-wf) para receber os dados \
   * [public-route]: irá usar uma a validação de uma rota publica(do target-wf) para receber os dados \
   * [inner-data]: vai injetar os dados sem validação 
   */
  mode: 'by-step' | 'public-route' | 'inner-data',
  /** 
   * Se mode [by-step] = [web-id-do-step-target] \
   * Se mode [public-route] = [variant-da-public-route-post] \
   * Se mode [inner-data] será desconsiderado 
   */
  mode_key?: string,
  /** Necessário apenas se mode [by-step] e a etapa tiver mais de uma ação */
  action_key?: string
  /** Caso queira gerar algum efeito colateral no registro atual após realizar a transferẽncia */
  effect?: {
    /** 
     * ```{ [target_successfuly_id]: [origin_data_id] } ``` \
     * Especifica quais dados serão copiados para o registro de origem e onde. 
     */
    success?: Record<string, string>
    /** 
     * Caso gere erro, onde quer armazenar a resposta de erro no registro de origem, \
     * e se quer colocar uma mensagem padrão, ou se não preenchido, usar a retorna no destino 
     */
    error?: {
      key: string,
      default?: string
    }
  }
}
export interface WorkflowConfigObserverFnType {
  /** EVENTS -> available names on type event
   * 
   * \@revalidate-when-updated-product: Evento válido apenas no FlowData, para revalidação de estoque na \
   * estrutura do WF Duzani.
   * 
   * \@search-and-fill-data-with-match: Evento válido apenas no FlowData, para consultar flowEntity auxiliar \
   * e preencher flowData com dados adicionais.
   * 
   * \@fill-additional-data-with-match: Evento válido apenas no FlowEntity, para atualizar dados no flow data.
   * 
   * \@flow-network: Evento válido apenas no FlowData, para conectar dois workflows
   * 
   * \@calendar-event: Evento válido apenas no FlowData, para gerar eventos no calendário da empresa
   * 
   * \@delete-from-calendar: Evento válido apenas no FlowData, para excluir eventosd do calendário
   * 
   * \@replicate: Evento válido apenas no FlowData, para replicar um registro em N
   * 
   * \@to-affect: Evento válido apenas no FlowData, para disparar efeitos em outros registros
   * 
   * \@consolidate: Evento válido apenas no FlowData, para unir registros
   */
  name: string,
  type: 'append' | 'backup' | 'event',
  execute: 'before' | 'after',
  condition?: string,
  unique?: boolean,
  /**
   * - Caso seja type === 'event', os valores válidos para o campo value \
   * são 'async'(default) ou 'sync', que definem se a requisição irá ou não \
   * esperar a resposta do evento.
   * - Caso seja type === 'backup' o value é ignorado
   * - Caso seja type === 'append' o value é o valor a ser adicionado
   * - Caso seja type === 'append' e value = \@entity é obrigatório informar o \
   * data com a configuração de como a entidade será integrada ao registro.
   */
  value?: any,
  /** 
   * BACKUP(type)
   * Se a ideia for fazer um array de backups por flow-data, com o primeiro níve da entidade dinâmica \
   * sendo um sub-schema baseado no flow-data-id, não é necessário informar o data, mas caso contrário \
   * defina o data seguindo a tipagem de [WfConfigObserverBackupData]
   * 
   * EVENTS
   * 
   * \@search-and-fill-data-with-match
   * ```
   *  {
   *    // Caminho para um array em um subnível do registro
   *    scope: string,
   *    // { [ref. no flowData]: [ref. no flowEntity] }
   *    match: Record<string, string>,
   *    // { [ref. no flowData]: [ref. no flowEntity] }
   *    // Se add ! no começo da key-ref, o replace só ocorrerá se o campo não for preenchido no flowData
   *    // Se add ? no começo da value-ref, o replace só ocorrerá caso o campo seja válido no flowEntity
   *    replacers: Record<string, string>,
   *    // Nome da entidade dinâmica
   *    entity: string,
   *    // { [ref. no flowData]: [ref. no flowEntity] }
   *    // Caso não de match com nenhum valor da entidade dinâmica, salvar em flowEntity
   *    noMatchThenSave?: Record<string, string>,
   *    // [<ref.flowData>, <ref.flowEntity>]: Otimiza a pesquisa no flowEntity para buscar 
   *    // apenas dados relevantes
   *    filter?: [string, string]
   *  }
   * ```
   * 
   * \@fill-additional-data-with-match
   * ```
   *  {
   *    // Caminho para um array em um subnível do registro
   *    scope?: string,
   *    // { [ref. no flowEntity]: [ref. no flowData] }
   *    match: Record<string, string>,
   *    // { [ref. no flowEntity]: [ref. no flowData] }
   *    // Se add ? no começo da key-ref, o replace só ocorrerá caso o campo seja válido
   *    replacers: Record<string, string>,
   *    // Filtro do mongo para especificar os flowDatas atingidos
   *    query: any
   * }
   * ```
   * 
   * \@flow-network: seguir tipagem de [FlowNetworkParams]
   * 
   * \@webhook: o data deve conter a prop webhook com o slug da webhook chamada.
   * 
   * \@calendar-event: seguir a tipagem de [WFCalendarEventType]
   * 
   * \@delete-from-calendar: seguir a tipagem de [WFDeleteFromCalendarEventType]
   * 
   * \@replicate: seguir a tipagem de [ReplicateFlowDataType]
   * 
   * \@consolidate: seguir a tipagem de [ConsolidateFlowDataEventType]
   * 
   * \@to-affect: seguir a tipagem de [ToAffectFlowDataEventType]
   * 
   * APPEND -> required data on value = \@entity
   * 
   * \@entity: seguir tipagem de [WFConfigObserverDataEntity]
   */
  data?: any
}
export interface WFConfigObserverDataEntity {
  entity_key: string,
  /** Parâmetros de pesquisa do get-flow-entity-datas */
  request?: {
    find?: {
      key?: string,
      query?: {
        ref: WorkflowConfigFilterRefType | WorkflowConfigFilterRefType[],
        type: WorkflowConfigFilterType['type'],
        value: any
      }[]
    }
  },
  /** O que fazer quando receber a resposta */
  then: {
    /** Path de qual parte da resposta deseja acessar, se não for inserido, retornará a resposta inteira */
    get?: string,
    /**
     * Caso deseje parsear o objeto(ou array) de resposta, basta passar um \
     * Record<caminho-que-irá-salvar, conteúdo/caminho-na-resposta>. Para mencionar variáveis é necessário \
     * usar shortcodes \@[path-na-resposta]
     */
    parse?: Record<string, any>,
    /**
     * - Se não for passado throw, caso retorne um erro, ou o parametro [get] não seja satisfeito, \
     * será preenchido com undefined.
     * - Se for passado o valor \@current a mensagem de erro será disparada.
     * - Se for passado um valor diferente será emitida uma mensagem de erro com a mensagem \
     * descrita abaixo
     */
    throw?: string
  }
}
export interface ConfigViewModeColumnsType {
  /** 
   * É possível adicionar algumas palavras reservadas para uma renderização
   * customizada, como:
   * - \@user: Gera o avatar, com email e nome do usuário (criador do flow-data)
   * - \@owners(em-desenvolvimento): Gera os avatares aninhados com tooltip com nome e email (owners do flow-data)
   * - created_at: Data de criação do flow_data
   * - step: Etapa atual do flow_data
   * - \@title-and-subtitle:id_1,id_2: Usará dois campos para renderização usando o primeiro como titulo e o segundo 
   *   como subtitulo com uma letra um pouco menor
   */
  id: '@user' | '@owners' | 'created_at' | 'step' | '@title-and-subtitle:id_1,id_2' | string,
  name: string,
  type: IntegrationExcelColumnTypeType,
  /**
   * Serve para fazer correspondência entre valores, exemplo, em um campo boolean:
   * 
   * 'true': 'Ativo' \
   * 'false': 'Inativo'
   * 
   * Podendo ter também, '_default' que define o valor padrão caso não seja satisfeito.
   */
  translate?: Record<string, string>
}
type WorkflowFilterScopeFilter = Record<string, string> | Record<string, {
  type: WorkflowConfigFilterType['type'],
  value: any
}>
export interface WorkflowViewModeFilterScope {
  /**
   * String-conditional, com os hardcodes:
   * 
   * \@group_permission: Que usa o grupo de permissão do usuário como base \
   * \@actions_permissions: Que usa as ações que o usuário pode executar como base \
   * \@me: Id do usuário logado
   */
  condition?: string,
  filter?: Record<'$or', Array<WorkflowFilterScopeFilter>> | WorkflowFilterScopeFilter,
  /**
   * Se for true, e a condição for verdadeira, interrompera a validação dos próximos filtros
   */
  break?: boolean
}
export interface ViewModeOrderBy{
  ref: string,
  orientation?: 'desc' | 'asc',
  /** Utilizado apenas quando ViewMode é do tipo kanban e deseja ter um tipo de ordenação diferente por coluna */
  available_steps?: string[]
}
export interface WorkflowViewModeBase {
  title: string,
  description?: string,
  icon?: AvailableIcons,
  slug: string,
  order_by?: ViewModeOrderBy | ViewModeOrderBy[],
  /** { 'ref-no-flow-data': 'título-visual' } */ 
  dynamic_order_by?: Record<string, string>,
  /** Group permission separado por virgula */
  permission?: string,
  /** 
   * Existem alguns valores pré-definidos que geram pesquisas mais complexas como:
   * - \@array-exists-and-gt-0: { "key": { $exists: true, $not: { $size: 0 } } }
   * - \@array-not-exists-or-eq-0: { $or: [{ "key": { $exists: false } }, { "key": { $size: 0 } }]}
   */
  filter?: Record<string, string>,
  /**
   * Escopo de visualização do usuário. \
   * Está funcionalidade delimita os dados que este usuário pode interagir
   */
  filter_scope?: WorkflowViewModeFilterScope[]
  /** Caso essa opção seja configurada, ele redefinirá o comportamento padrão de redirecionamento
   *  de steps. Ou seja, quando clicar em um flowData na tabela, em vez de abrir o step atual, ele abrirá
   *  para o definido abaixo, e o mesmo se aplica após o envio do submit, que ele sempre redirecionará o
   *  usuário para o step abaixo, a não ser se o target for um stateless_step
   */
  redirect_to_stateless_step?: string
}
export interface KanbanFlagType{
  condition: string,
  type: ThemeColorType,
  availableSteps?: string[],
  /** Um caracter que será mostrado na flag */
  subtitle?: string,
  tooltip?: string
}
export interface WorkflowViewModeKanban extends WorkflowViewModeBase {
  view_mode: 'kanban',
  /** Conteúdo do card */
  resume: {
    /** Identificador no card */
    identifier?: string,
    identifier_mask?: 'date' | 'phone' | 'percent' | 'money' | 'cpf-cnpj',
    /** 
     * Se mostrará o avatar no card:
     * 
     * \@creator: Avatar do criador do registro \
     * \@owner: Avatar dos responsáveis pelo registro \
     * string: Referência do campo que armazena a imagem customizada do avatar 
     **/
    avatar?: "@creator" | "@owner" | string,
    content: (ConfigViewModeColumnsType & { available_steps?: string[] })[],
    classNames?: Partial<{ wrapper: string, [key: string]: string }>
  },
  flags?: KanbanFlagType[],
  tasks_indicator?: { id: string, status: StepViewTasksType['status'] }[]
}
export interface WorkflowViewModeTable extends WorkflowViewModeBase {
  view_mode: 'table',
  columns: ConfigViewModeColumnsType[],
}
export interface WorkflowViewModeDashboard extends WorkflowViewModeBase{
  view_mode: 'dashboard',
  modules: Array<WorkflowViewModeDashboardModule>
}
export interface WorkflowViewModeDashboardModule{
  key: string
  mode: 'card' | 'chart',
  /** Dados que irão gerar o gráfico ou renderizar os cards */
  datas: {
    values: any,
    /** false (default) */
    static?: boolean
  },
  /**
   * \<apontamento-de-elementos\>: \<classes-css\>
   * 
   * - container: se refere a primeira div do módulo
   * - card: caso o tipo seja card, essa classe lida com a primeira div de cada card
   * - header/body/footer: geralmente utilizado com o card para referênciar a primeira \
   * div das separações
   * - (header/body/footer).*: significa que todos os itens do primeiro nível dessa sessão \
   * receberá a classe
   */
  classNames?: Record<string, string>,
  global_fns?: Record<string, WorkflowViewModeDashboardGlobalFn>
  header: Array<WorkflowViewModeDashboardModuleBlock>,
  body: Array<WorkflowViewModeDashboardModuleBlock>,
  footer: Array<WorkflowViewModeDashboardModuleBlock>
}
export interface WorkflowViewModeDashboardGlobalFn{
  name: WorkflowViewModeDashboardFn['name'],
  foreach: { store: Array<WorkflowViewModeDashboardStore> }
  data?: { filter?: any, dynamic_filters?: boolean }
}
export interface WorkflowViewModeDashboardStoreBase{
  condition?: string,
  breakExec?: boolean,
}
export interface WorkflowViewModeDashboardStoreSingle extends WorkflowViewModeDashboardStoreBase{
  key: string,
  assign: 'counter' | 'cumulative' | 'overwrite' | 'merge',
  name?: string,
}
export interface WorkflowViewModeDashboardStoreGroup extends WorkflowViewModeDashboardStoreBase{
  assign: 'group'
  effects: (WorkflowViewModeDashboardStoreSingle | WorkflowViewModeDashboardStoreGroup)[]
}
export type WorkflowViewModeDashboardStore = WorkflowViewModeDashboardStoreSingle | WorkflowViewModeDashboardStoreGroup
export type ViewModeDashboardModuleFormattingType = 'money' | 'number' | 'point' | '@user.name';
export interface WorkflowViewModeDashboardModuleBase{
  key: string,
  
  /**
   * Valores com suporte a shortcodes, e dentro dos seguintes escopos:
   * 
   * - global: variáveis globais do módulo
   * - curr: valor atual retornado pela função
   * - item: item percorrendo o módulo
   */
  values: string[],
  /**
   * - point: Este formato é apenas para converter um valor RGB/Hexadecimal em uma bolinha(point)
   */
  formatting?: Record<number, ViewModeDashboardModuleFormattingType>,
  fn?: WorkflowViewModeDashboardFn
}
export interface WorkflowViewModeDashboardModuleChart extends WorkflowViewModeDashboardModuleBase{
  mode: 'pie-chart',
  /** Se não forem mencionadas cores suficientes, serão geradas automaticamente */
  colors: string[],
  chart_settings?: {
    format?: { 
      /** true (default) */
      yaxis?: boolean,
      /** true (default) */
      xaxis?: boolean
    },
    /** true (default) */
    legend?: boolean,
    /** false (default) */
    show_details?: boolean
  },
}
export interface WorkflowViewModeDashboardModuleGaugeBarRange{
  title?: string,
  subtitles?: string[],
  /** Index de inicio da barra de gauge dentro do values */
  start: number,
  /** Último index da barra de gauge dentro do values, se não mencionada fará até o item final */
  end?: number,
  /** Hexadecimal, se não for mencionado gerará as cores dinamicamente */
  colors?: string[]
}
export interface WorkflowViewModeDashboardModuleGaugeBar extends WorkflowViewModeDashboardModuleBase{
  mode: 'gauge-bar',
  /**
   * Range é utilizado para montar os itens que estarão formando uma barra de gauge, \
   * os itens que não tiverem dentro do range se comportarão como itens normais. \
   * E cada posição do array não pode ter index conflitantes para que os ranges não \
   * se sobreponham.
   */
  ranges: WorkflowViewModeDashboardModuleGaugeBarRange[]
}
export interface WorkflowViewModeDashboardModuleBasic extends WorkflowViewModeDashboardModuleBase{
  /**
   * - list-progress: No list-progress o último item é utilizado para gerar o progresso
   */
  mode: 'list-progress' | 'list' | 'box' | 'strong',
  
}

export type WorkflowViewModeDashboardModuleBlock = WorkflowViewModeDashboardModuleBasic | WorkflowViewModeDashboardModuleChart | WorkflowViewModeDashboardModuleGaugeBar;

export interface WorkflowViewModeDashboardFn{
  name: '@count-data-by-step' | '@count' | '@flow-datas' | '@static',
  value?: any,
  data?: { filter?: any, dynamic_filters?: boolean }
}

export type AvailableViewModesType = WorkflowViewModeTable | WorkflowViewModeKanban | WorkflowViewModeDashboard;

export interface WorkflowAuthTemplateType {
  id: string,
  type: 'email' | 'message',
  params: Record<string, string>,
  matchs: Record<string, string>
}

export type WorkFlowTemplateKeyType = 'first_access' | 'forgot_password';

export interface WorkflowAuthType {
  props: {
    email: string,
    name: string,
    picture?: string,
    link?: string,
    template?: Record<WorkFlowTemplateKeyType, WorkflowAuthTemplateType[]>
  },
  body: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>,
  /**
   * - [@link-auth]     Link para o primeiro login, e em seguida a definição da senha
   * - [@temp-token]    Enviar um token temporário por email/whatsapp
   * - [@temp-password] Enviar senha temporária por email/whatsapp
   * - [@manual]        Cria a senha no momento do cadastro
   */
  mode_start: '@link-auth' | '@temp-token' | '@first-password' | '@manual',
  notify: { email?: string, whatsapp?: string, sms?: string },
  routes: {
    get: Record<string, {
      body: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>
    }>,
    post: Record<string, {
      scope?: string,
      body: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>,
      mode: 'merge' | 'overwrite'
    }>,
  }
}
export type AvailableTriggerEffects = 'onload-to-fill-the-page-if-necessary' | 'refresh-flow-datas' | 'success-message'
export interface WorkflowTriggerType {
  /** Referência interna */
  id: string,
  /** 
   * Referência ao evento que será disparado:
   * 
   * \@sync-flow-datas: Sincronizar integração de dois workflows
   * 
   * \@gamification-action-log: Lidar com logs de ação em gamificação
   * 
   * \@observer-event: Dispara N eventos do observer apontando a condition
   */
  name: '@sync-flow-datas' | '@gamification-action-log' | '@observer-events',
  title: string,
  /** Se o evento será feito em segundo plano ou se terá resposta imediata */
  is_async: boolean,
  /**
   * Dados adicionais
   * 
   * \@sync-flow-datas \
   * ```
   *  {
   *    target_flow_id: "id-do-wf-de-destino",
   *    match: { "id-from-current-wf": "id-from-target-flow" }
   *  }
   * ```
   * 
   * \@observer-events \
   * Adicione as condicionais dos eventos do observer que quer disparar
   * ```
   *  {
   *    matchs: Array<{ condition: string, name: string }>
   *  }
   * ```
   */
  data: any,
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
type AvailableTimeToNotify = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
export const availableTimeToNotify: AvailableTimeToNotify[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
export type AvailableHoursType = Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, [string, string]>>
export interface WorkflowConfigSlasType {
  title: string,
  icon?: AvailableIcons,
  /** 
   * Horário aproximado de que os usuários serão notificados(min 8h | max 18h).
   * 
   * Default: 9h
   */
  time_to_notify?: AvailableTimeToNotify,
  notify?: WFConfigSlaNotifyType[],
  outher_fields?: WorkflowSlaOutherField[],
  permission?: string,
  filter_scope?: WorkflowViewModeFilterScope[],
  columns: ConfigViewModeColumnsType[],
  /**
   * Número negativo representando apartir de quantos dias \
   * antes do vencimento os itens devem aparecer no painel
   * 
   * Por padrão -1d
   */
  show_after_from?: number,
  /**
   * Horas válidas para o calculo de sla (válido apenas quando sla em horas)
   * 
   * - key: 0 - Domingo | ... | 6 - Sábado
   * - value: Era de inicio e fim de expediente. Exemplo ['08:00', '18:00']
   */
  available_hours?: AvailableHoursType,
  /** 
   * Configurar tabela de exceção de dias(como feriados, ou dias especiais \
   * com carga horária útil fora do padrão).
   * 
   * Para fazer essa configuração você deve ter uma entidade dinamica que \
   * possua no mínimo um campo data.
   */
  days_exception_settings?: {
    entity_key: string,
  }
}
export interface WFConfigSlaNotifyType {
  subject: string,
  /**
   * Quem será notificado:
   *
   * - \@creator: Criador do registro 
   * - \@owners: Responsáveis pelo registro
   * - \@flow_auth: O usuário que represta o próprio registro
   * - \@flow_owner: Responsável pelo fluxo
   * - \@group_permission:n: Onde o [n] deve ser substituido pelo grupo \
   *   de permissão do qual deseja notificar todos participantes. Pode ser\
   *   utilizado virgula como separador para mencionar várias permissões
   * - string: Caminho para o endereço de notificação (email ou telefone) \
   *   Pode ser utilizado virgula como separador para indicar vários campos
   * 
   * Exceto no caso da string, que é inserido diretamente o endereço de notificação \
   * selecionando o meio de notificação automaticamente, os demais respeitarão as \
   * preferências do usuário notificado.
   */
  to: ('@creator' | '@owners' | '@flow_owner' | '@group_permission:n' | string)[],
  /**
   * Número de dias com base no calculo de SLA \
   * Alguns códigos podem ser agregados ao número, como:
   * 
   * - [>] Sinal de maior que, usado para maior ou igual
   *    > ( >0 : maior ou igual a 0 )
   * - [<] Sinal de menor que, usado para menor ou igual
   *    > ( <0 : menor ou igual a 0 )
   * - [\~] Usado para valores em um intervalo
   *    > ( 1~5 : maior ou igual a 1 e menor ou igual a 5 )
   * - [^] Usando para descrever uma progressão aritmética
   *    > ( 0^2 : dessa forma irá pegar apenas números pares)
   */
  when: string,
  /** Se não for especificado será aplicado a todas etapas */
  available_steps?: string[],
  props: {
    id: string,
    description: string,
    show_sla?: boolean
  },
  /**
   * Com suporte a shortcode \@[variable] para injetar valores dinâmicos
   * 
   * Valores disponíveis:
   * - wf.title = Titulo do fluxo
   */
  content: string
}
export interface WorkflowWebhookInfoType {
  type: 'RDStation Marketing' | 'ISAC',
  name: string,
  relations?: Record<string, any> | undefined;
  /**
   * Se [type] === 'ISAC' as props devem ser:
   * - url (string | required)
   * - ref (string | opcional) A ref é um identificador de referência do registro
   */          
  props?: any,
  effects?: {
    /** Efeito considerado apenas em caso de (sucesso, erro ou sempre respectivamente) */
    only: 'success' | 'error' | 'always',
    condition?: string,
    /** Valores que serão atualizados no flowData */
    append_values: Record<string, any>
    /** Interromper os efeitos colaterais assim que o primeiro der match no condition */
    breakExec?: boolean
  }[]
}
export type WorkflowWebhookType = Record<string, WorkflowWebhookInfoType>
export interface PublicViewFlowDataType {
  mode: 'flow-data',
  available_steps: string[],
  ignore_flow_data_id?: boolean,
  restrictions?: {
    /** STRC para validar se o flow_data pode ou não ser acessado */
    condition: string,
    /** Mensagem de erro caso a condição seja verdadeira */
    message: string
  }[],
  protected?: {
    fields: Record<string, StepItemType>,
    title: string,
    description?: string,
    buttonText?: string
  },
  /** Parametros da url que ficarão disponível no observers */
  observable_params?: Record<string, {
    label?: string,
    /** No caso do select é obrigatório informar o options*/
    type: 'text' | 'select',
    options?: string[],
    required: boolean
  }>
}
export interface WorkflowMenuShortcut{
  id: string,
  /**
   * O **to** pode ser uma url externa ou um shortcode
   * referência uma url do hub ou do isac.
   * 
   * \@hub:nome-da-rota(param) para acessar alguma rota do hub \
   * \@isac:nome-da-rota(param1,param2) para acessar alguma rota do isac
   * 
   * O valor entre parentes é usado para passar 1 ou mais parametros para a rota
   */
  to: string,
  /** Icones disponíveis na página de icones */
  icon?: AvailableIcons,
  title: string,
  action_permission?: string,
}
export interface WorkflowConfigType {
  actions?: WorkflowConfigActionsType[],
  view_modes?: AvailableViewModesType[],
  filters?: Record<string, WorkflowConfigFilterType[]>,
  permissions?: ConfigPermissionType,
  menu?: {
    /**
     * Id de todas as configurações que podem gerar botões para acesso no menu. \
     * Abaixo terá um exemplo do prefixo de uma view, entidade, entre outros:
     * 
     * - view:     view-mode--vm-slug
     * - entity:   entity--en-id
     * - shortcut: shortcut--id
     */
    ordenation?: string[],
    shortcuts: WorkflowMenuShortcut[]
  },
  triggers?: WorkflowTriggerType[],
  webhooks?: WorkflowWebhookType,
  notifications?: WorkflowConfigNotificationType[],
  integrations?: WorkflowConfigIntegrationsType,
  services?: {
    auth?: WorkflowAuthType,
    autocomplete?: WorkflowConfigAutocomplete[],
    observers?: {
      onCreate?: WorkflowConfigObserverFnType[],
      onUpdate?: WorkflowConfigObserverFnType[],
      onDelete?: WorkflowConfigObserverFnType[],
      onChangeOwner?: WorkflowConfigObserverFnType[],
      /** Tem acesso a variável _taks_id contendo o id da task alterada */
      onChangeTask?: WorkflowConfigObserverFnType[],
      /** Tem acesso a variável _taks_id contendo o id da task excluída */
      onDeleteTask?: WorkflowConfigObserverFnType[]
    },
    publicRoutes?: {
      get?: Record<string, {
        /**
         * Por padrão a rota publica sempre fará uma requisição em [flow-datas], \
         * mas esse comportamento pode ser alterado definindo este campo como [steps] \
         * ou [me], porém os demais modos as funções de pesquisa, filtro e formatação \
         * do body são limitadas.
         * 
         * O modo [me] só é valido caso auth seja preenchido com o tipo [\@network-flow-auth], \
         * e neste caso, retornará o usuario autenticado.
         * 
         * Existe o tipo [count-flow-datas], que ira retorna o total de registro com base no \
         * filtro realizado. Este tipo não tem suporte a prop [body] e [order_by]
         */
        request?: 'flow-datas' | 'steps' | 'me' | 'count-flow-datas',
        auth?: AuthPublicRouteType,
        /**
         * Query Params disponíveis para pesquisa.
         * 
         * Record< [query-param] , [path-no-flow-data] >
         * 
         * Palavras reservadas: take, skip
         * 
         * Toda a pesquisa será feita por comparação absoluta, a menos \
         * que o valor inicie com ~. Ex:
         * 
         * ```
         * { id: '~path.id' }
         * ```
         * 
         * Desse jeito fará a pesquisa parcial case insensitive.
         */
        available_query_params?: Record<string, string>,
        order_by?: Record<string, 'desc' | 'asc'>,
        filter_scope?: WorkflowViewModeFilterScope[],
        /** Se não for informado trará o flow_data.data completo */
        body?: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>
      }>,
      post?: Record<string, {
        auth?: AuthPublicRouteType,
        /** Escopo de alteração dentro do objeto flow_data.data */
        scope?: string,
        /** Se não for informado trará o flow_data.data completo */
        body?: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>,
        /** 
         * É utilizado apenas quando a requisição inclui find.
         * 
         * - [merge] Mascla os dados com o do registro encontrado (interfere apenas flowData.data)
         * - [overwrite] Sobrescreve os dados do registro encontrado (interfere apenas flowData.data)
         * - [process] Realiza alguma ação interna configurado em rules
         */
        mode?: 'merge' | 'overwrite' | 'process',
        /** Se for true, desabilita a funcionalidade find */
        only_creation?: boolean,
        schema?: Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>,
        rule?: {
          available_steps?: string[],
          append_value?: Record<string, any>
        },
        effects?: {
          /** Efeito considerado apenas em caso de (sucesso, erro ou sempre respectivamente) */
          only: 'success' | 'error' | 'always',
          condition?: string,
          /** Valores que serão atualizados no flowData */
          append_values: Record<string, any>
          /** Interromper os efeitos colaterais assim que o primeiro der match no condition */
          breakExec?: boolean
        }[]
      }>,
      /**
       * Visualizações públicas são páginas abertas,
       * que podem ser montadas com base em stateless-step,
       * ou flow-entities
       * 
       * O mode definirá o escopo de interação do usuário convidado:
       * 
       * - flow-data: Irá interagir com apenas um registro
       * - (feature) flow-entity: Irá interagir com uma entidade dinâmica especifica
       * - (feature) flow: Irá interagir com todos(ou apenas parte) registros do fluxo
       */
      view?: Record<string, PublicViewFlowDataType | {
        mode: 'flow-entity' | 'flow'
      }>
    },
    calendar?: {
      filter_scope?: {
        /** String Condition baseada no usuário solicitante da request */
        condition?: string,
        /**
         * - [protected] Pode ver todos os eventos da empresa
         * - [private] Pode ver apenas os eventos que é guest
         * - [public] Pode ver apenas os eventos públicos
         */
        access_modifier?: "protected" | "private" | "public",
        filter?: Record<string, string> | Record<string, {
          type: WorkflowConfigFilterType['type'],
          value: any
        }>,
        /** Interromper assim que a condition for true */
        break?: boolean,
      }[]
    }
  },
  schema?: Record<string, FlowEntitySchemaInfo>,
  slas?: WorkflowConfigSlasType,
  routines?: WorkflowRoutinesType,
  owner?: {
    id?: string
    name: string,
    cnpj: string,
    email: string,
    whatsapp: string
  },
  rules?: WorkflowConfigRulesType[]
}
export interface WorkflowConfigIntegrationsType {
  email?: {
    emailFrom: string,
    host?: string,
    port?: number,
    service?: string,
    auth?: { user: string, pass: string }
  },
  whatsapp?: { number: string, token: string },
  sms?: any,
  chatbot?: any,
  omie?: {
    secret_key: string,
    public_key: string
  },
  rds_marketing?: {
    client_id: string,
    client_secret: string,
    refresh_token?: string,
    access_token?: string,
    expires_in?: number
  },
  outhers?: {
    key: string,
    name: string,
    status: boolean,
    data: any
  }[]
}
export type AuthPublicRouteType = AuthPublicRouteSimpleToken | AuthPublicRouteNetworkFlowAuth;
export interface AuthPublicRouteSimpleToken {
  /** Token criptografado e armazenado no FlowEntity */
  mode: "@simple-token",
  entity_key: string,
  props: {
    /** path do token dentro da entidade dinâmica */
    token: string
  }
}
export interface AuthPublicRouteNetworkFlowAuth {
  /** Usará o token do flowAuth de outro workflow */
  mode: "@network-flow-auth",
  flow_network_id: string,
  props: {
    /** path do id do flowAuth, dentro do wf atual */
    external_id: string
  }
}
export interface WorkflowSlaOutherField extends Omit<StepSlaType, 'stay'> {
  /** Caminho dentro do flowData.data para o campo de data que gerencia esse SLA */
  key: string,
  title: string,
}
export type WFCActionRenderIn = 'top' | 'filter-bar' | 'slide-over'
export interface WFCActionFnCallStep {
  type: 'call-step',
  target: string
}
export interface WFCActionFnUpdateSelected {
  type: 'update-selected',
  /**
   * O que fazer quando atualizar:
   * - update (default): Apenas atualizar
   * - update-and-open: Atualiza e abre o último atualizado
   * - update-and-remove: Atualiza e remove da tabela e do excludeIds 
   */
  effect?: 'update' | 'update-and-open' | 'update-and-remove',
  append_values: Record<string, any>,
  trigger_observer_events?: string[],
  confirm?: StepActionConfirmType,
  /**
   * O que fazer em confirmação múltipla:
   * - individual-confirmation (default): Cada um terá sua confirmação separadamente 
   * - one-confirm-all: Ao confirmar a primeira, infere que todas as demais serão confirmadas
   */
  confirm_mode?: 'individual-confirmation' | 'one-confirm-all',
}
export interface UpdateMainAndSelectedAppendValues{
  origin: 'static' | 'main' | 'selecteds',
  value: any
}
export interface WFCActionFnUpdateMainAndSelected {
  type: 'update-main-and-selecteds',
  /**
   * O que fazer quando atualizar:
   * - update (default): Apenas atualizar
   * - update-and-open: Atualiza e abre o principal
   */
  effect?: 'update' | 'update-and-open',
  confirm?: StepActionConfirmType,
  append_values: {
    main?: Record<string, UpdateMainAndSelectedAppendValues>,
    selecteds: Record<string, UpdateMainAndSelectedAppendValues>
  },
  /** Condicionais para decidir quais itens podem ser selecionados */
  selectables?: string[]
}
export interface WFActionFnCallTrigger {
  type: 'call-trigger',
  target: string,
  /** false (default) */
  id_is_required?: boolean,
  /** Este confirm não tem suporte a inserção de dados */
  confirm?: StepActionConfirmType
}
export interface WFActionFnCallSingleEntity {
  type: 'call-single-entity',
  target: string,
}
export interface WFActionFnRedirect {
  type: 'redirect',
  to: string,
  target?: '_blank'
}
export interface WFActionFnDownloadFiles {
  type: 'download-files',
  /** Nome que salvará o arquivo */
  identify: string,
  paths: string[],
  fake_files?: {
    name: string,
    content: {
      id: string,
      title: string,
      mask?: StepItemAttrMaskType,
    }[]
  }[],
  confirm?: StepActionConfirmType,
  /**
   * O que fazer em confirmação múltipla:
   * - individual-confirmation (default): Cada um terá sua confirmação separadamente 
   * - one-confirm-all: Ao confirmar a primeira, infere que todas as demais serão confirmadas
   */
  confirm_mode?: 'individual-confirmation' | 'one-confirm-all',
}
export interface WFActionFnCallReport {
  type: 'call-report',
  target: string
}
export interface WorkflowConfigActionsType {
  icon?: 'new' | 'delete' | AvailableIcons, /* [obsoletos]: | 'update' | 'alarm' | 'search' | 'models' */
  /** Os ids pré-definidos possuem funções e comportamentos pré-definidos
   * 
   * start-flow: 
   *  - Chama a execução da primeira etapa do fluxo
   *  - É renderizado no topo da página
   * 
   * delete-datas:
   *  - Excluí multiplos flow_datas
   *  - É renderizado na barra de filtro ao lado do filtro de etapas
   *  - Possui renderização condicional, aparecendo somente quando existe items selecionados
   */
  id: 'start-flow' | 'delete-datas' | string, /*[obsoletos]: | 'list-datas' | 'alarm' | 'search' | 'models' */
  alt: string,
  /**
   * Pode ser usada uma permissão existente em [wf.config.permissions.actions] \
   * ou pode ser utilizados shortcodes como:
   * - [\@data_owners]: Quando apenas os responsáveis pelo registro podem \
   * executar a ação
   */
  action_permission?: string,
  available_view_modes?: string[],
  render?: {
    in: WFCActionRenderIn,
    /** Não implementado */
    condition?: string
  },
  /**
   * As funções do tipo WFCActionFnUpdateSelected, WFActionFnDownloadFiles e \
   * com id delete-datas, são do modo selectable (ou seja, dependem de um item \
   * selecionado, e geralmente ficam no filter-bar)
   * 
   * As demais são funções globais, que são geralmente localizadas no topo.
   * 
   * A função WFCActionFnUpdateMainAndSelected necessita ser chamada por um item(exemplo no slide-over) \
   * e depois ser complementada com a seleção de N itens.
   */
  fn?: WFCActionFnCallStep | WFCActionFnUpdateSelected | WFCActionFnUpdateMainAndSelected | WFActionFnCallTrigger | WFActionFnCallSingleEntity | WFActionFnDownloadFiles | WFActionFnRedirect | WFActionFnCallReport | WFActionFnCallWebhook | WFActionFnCallExternalRequest
}
export interface ConfigPermissionType {
  groups: PermissionType[]
  actions: string[]
}
export interface WorkflowRoutinesType {
  view?: {
    title: string,
    icon?: AvailableIcons,
    permission: string,
  },
  executors: AvailableRoutinesExecutorsType[],
}
export const availableExecutorsTypes: (AvailableRoutinesExecutorsType['type'])[] = ['sync-ivrim-big-data', 'integration-omie', 'manage-flow', 'make-notifications']
export type AvailableRoutinesExecutorsType = WorkflowRoutinesExecutorIBD | WorkflowRoutinesExecuterIOmie | WorkflowRoutinesManageFlow | WorkflowRoutinesMakeNotifications
interface WorkflowRoutinesExecutorBase {
  name: string,
  description: string,
  last_executed_in?: Date,
  /**
   * Qual horário a rotina será executada. Por padrão ela é executada imediatamente, \
   * caso queira definir, o horário é de 00:30 até 23, pulando de meia em meia hora \
   * (.5 = 30min)
   */
  time_to_exec?: 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10 | 10.5 | 11 | 11.5 | 12 | 12.5 | 13 | 13.5 | 14 | 14.5 | 15 | 15.5 | 16 | 16.5 | 17 | 17.5 | 18 | 18.5 | 19 | 19.5 | 20 | 20.5 | 21 | 21.5 | 22 | 22.5 | 23,
  /**
   * Intervalo(em dias) em que a rotina repetirá. \
   * Por padrão o valor é 1 (todo dia)
   */
  interval?: number,
}
export interface WorkflowRoutinesExecutorIBD extends WorkflowRoutinesExecutorBase {
  type: 'sync-ivrim-big-data'
  data?: WorkflowRoutinesExecutorIBDData
}
export interface WorkflowRoutinesExecutorIBDData {
  db_name: string,
  exception?: 'duzani-theme',
  data?: {
    client_ivrim: string,
    cost_center: string
  }

}
export const availableIBDExeptions: (WorkflowRoutinesExecutorIBDData['exception'])[] = ['duzani-theme']
export interface WorkflowRoutinesExecuterIOmie extends WorkflowRoutinesExecutorBase {
  type: 'integration-omie',
  data: {
    scope: "financial-movements",
    /** Record<path-no-omie, path-no-flow-data.data> */
    match: Record<string, string>,
    /** Query para selecionar flowDatas */
    query: Record<string, any>,
    /**
     * Estratégia de recuperação de flowDatas, utilizada quando \
     * os registros do omie não deram match com os flowDatas disponíveis,
     * pode ser configurada uma pesquisa de recuperação nos demais
     * flowDatas.
     */
    recovery?: {
      /** Condição para o movimento ser válido p/ recuperação  */
      condition?: string,
      /** Query adicionada na pesquisa de mais flowDatas */
      query: Record<string, any>,
    },
    effects: {
      /** String Conditional */
      condition?: string,
      /** Record<path-no-flow-data.data, path-na-resposta> */
      data: Record<string, string>
    }[]
  }
}
export interface WfRoutinesManageFlowEventIfmFinalizeTechnicianCalls{
  id: '@ifm-finalize-technician-calls',
  data: {
    entity_keys: {
      technicians: string,
      logs: string,
    }
  }
}
export type WorkflowRoutinesManageFlowEvent = WfRoutinesManageFlowEventIfmFinalizeTechnicianCalls;
export interface WorkflowRoutinesManageFlow extends WorkflowRoutinesExecutorBase {
  type: 'manage-flow',
  data: {
    /** 
     * Query de consulta do flowData seguindo padrões do mongodb. Com suporte ao \
     * codehelper ```__@now__```. O codehelper pode ser identificado caso esteja em \
     * alguma dessas condições:
     * - value : string
     * ```
     *  query: {
     *    'field': '__@codehelper__'
     *  }
     * ```
     * - value: object, contendo uma das chaves: $lt, $lte, $gt, $gte, $in
     * ```
     *  query: {
     *    'field': {
     *       $lt: '__@codehelper__'
     *    }
     *  }
     * ```
     */
    query: any,
    /** Efeitos colaterais nos registros encontrados */
    effects: {
      condition?: string,
      /** Se for true, irá interromper a execução a primeira ocorrência verdadeira */
      breakExec?: boolean,
      events?: WorkflowRoutinesManageFlowEvent[]
      append: Record<string, any>
    }[]
  }
}
export interface WorkflowRoutinesMakeNotifications extends WorkflowRoutinesExecutorBase {
  type: 'make-notifications',
  data: Array<Omit<WorkflowConfigNotificationType, 'condition'> & {
    /** 
     * Query de consulta do flowData seguindo padrões do mongodb. Com suporte ao \
     * codehelper ```__@now__```. O codehelper pode ser identificado caso esteja em \
     * alguma dessas condições:
     * - value : string
     * ```
     *  query: {
     *    'field': '__@codehelper__'
     *  }
     * ```
     * - value: object, contendo uma das chaves: $lt, $lte, $gt, $gte, $in
     * ```
     *  query: {
     *    'field': {
     *       $lt: '__@codehelper__'
     *    }
     *  }
     * ```
     */
    query: any,
    /**
     * Defina o nome da variável que conterá todos os flow-datas \
     * encontrados no query.
     * 
     * flow-datas (default)
     */
    data_id?: string
  }>
}
export interface WFActionFnCallWebhook {
  type: 'call-webhook',
  webhook: string
}
export interface WFActionFnCallExternalRequest {
  type: 'call-external-request',
  props: {
    url: string,
    method: 'GET'
  },
  mode: 'merge',
  schema: Record<string, ExternalRequestSchema>
}