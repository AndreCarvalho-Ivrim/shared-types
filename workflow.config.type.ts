import { FlowEntitySchemaInfo, FlowEntitySubSchema, IntegrationExcelColumnTypeType, PermissionType, StepActionConfirmType, StepItemAttrMaskType, StepSlaType } from "."
import { AvailableIcons } from "./icon.type";

export type AvailableServicesType = 'email' | 'whatsapp' | 'sms' | 'chatbot';
export type AvailableViewModeType = 'table' | 'dashboard';
export type WorkflowConfigFilterRefType = '@user.name' | '@user.email' | '@owner.name' | '@owner.email' | '@created_at' | '@step_id' | string
export interface WorkflowConfigFilterType {
  name: string,
  /**
   * - text: Pesquisa case incesitive por aproximação (includes)
   * - select: Pesquisa por palavra exata (===)
   * - date: Comparação por range de data (startDate, endDate)
   * - date-in: Oposto do anterior, é passado apenas 1 data, e deve ter duas refs \
   * onde a primeira é data inicial e a segunda afinal, e a verificação testa se a \
   * data passada está dentro do range do banco
   * - list: Lista de opções (in)
   */
  type: 'text' | 'select' | 'date' | 'list' | 'strc' | 'date-in',
  ref: WorkflowConfigFilterRefType | WorkflowConfigFilterRefType[],
  options?: string[] | { value: string, name: string }[],
  /** somente autocomplete.mode = 'distinct' */
  autocomplete?: string
}
export interface WorkflowConfigNotificationType {
  name: string,
  condition: string,
  template_id: string,
  type: 'email' | 'message',
  params: Record<string, string>,
  replacers: Record<string, string>,
  /* ANEXO */
  attachment?: string,
  /**
   * - [@data_creator]                Criador do flow data
   * - [@data_owners]                 Responsáveis pelo flow data
   * - [@wf_owner]                    Responsável pelo workflow
   * - [@to:<contact1>[,<contact2>]]  Contato(s) pré-definido(s)
   * - 'path-to-contact'              Caminho para o registro dentro do flow_data.data 
   *                                  que contenha o contato
   */
  target: '@data_creator' | '@data_owner' | '@wf_owner' | string,
}
export interface WorkflowConfigAutocomplete {
  name: string,
  mode: 'distinct' | 'search',
  ref: string,
  response?: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>,
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
   * \@calendar-event: Evento válido apenas no FlowData, para gerar eventos no calendário da empresa com base \
   * nos registros
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
   * EVENTS -> required data on events[\@search-and-fill-data-with-match, \@fill-additional-data-with-match, \@flow-network]
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
   * \@flow-network [FlowNetworkParams]
   * ```
   * {
   *    flow_id: string,
   *    // { [data_id]: [target_id] }
   *    match: Record<string, string>,
   *    // [by-step]: irá usar a validação de um step(do target-wf) para receber os dados
   *    // [public-route]: irá usar uma a validação de uma rota publica(do target-wf) para receber os dados
   *    // [inner-data]: vai injetar os dados sem validação
   *    mode: 'by-step' | 'public-route' | 'data-injection',
   *    // Se mode [by-step] = [web-id-da-step-target]
   *    // Se mode [public-route] = [variant-da-public-route-post]
   *    // Se mode [data-injection] será desconsiderado
   *    mode_key?: string,
   *    // Necessário apenas se mode [by-step] e a etapa tiver mais de uma ação,
   *    action_key?: string,
   *    // Caso queira gerar algum efeito colateral no registro atual após realizar a transferẽncia
   *    effect?: {
   *      // { [target_successfuly_id]: [origin_data_id] }
   *      // Especifica quais dados serão copiados para o registro de origem e onde.
   *      success?: Record<string, string>
   *      // Caso gere erro, onde quer armazenar a resposta de erro no registro de origem, 
   *      // e se quer colocar uma mensagem padrão, ou se não preenchido, usar a retorna no destino
   *      error?: {
   *        key: string,
   *        default?: string
   *      }
   *    }
   * }
   * ```
   * 
   * APPEND -> required data on value = \@entity
   * 
   * \@entity: seguir tipagem de [WFConfigObserverDataEntity]
   */
  data?: any
}
export interface WFConfigObserverDataEntity{
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
export interface WorkflowViewModeFilterScope{
  /**
   * String-conditional, com os hardcodes:
   * 
   * \@group_permission: Que usa o grupo de permissão do usuário como base \
   * \@actions_permissions: Que usa as ações que o usuário pode executar como base \
   * \@me: Id do usuário logado
   */
  condition?: string,
  filter?: Record<string, string> | Record<string, {
    type: WorkflowConfigFilterType['type'],
    value: any
  }>,
  /**
   * Se for true, e a condição for verdadeira, interrompera a validação dos próximos filtros
   */
  break?: boolean
}
export interface WorkflowViewModeBase{
  title: string,
  icon?: AvailableIcons,
  slug: string,
  order_by?: { ref: string, orientation?: 'desc' | 'asc' },
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
export interface WorkflowViewModeKanban extends WorkflowViewModeBase{
  view_mode: 'kanban',
  /** Conteúdo do card */
  resume: {
    /** Identificador no card */
    identifier?: string,
    /** 
     * Se mostrará o avatar no card:
     * 
     * \@creator: Avatar do criador do registro \
     * \@owner: Avatar dos responsáveis pelo registro \
     * string: Referência do campo que armazena a imagem customizada do avatar 
     **/
    avatar?: "@creator" | "@owner" | string,
    content: ConfigViewModeColumnsType[]
  }
}
export interface WorkflowViewModeTable extends WorkflowViewModeBase{
  view_mode: 'table',
  columns: ConfigViewModeColumnsType[],
}
export type AvailableViewModesType = WorkflowViewModeTable | WorkflowViewModeKanban;

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
export interface WorkflowTriggerType{
  /** Referência interna */
  id: string,
  /** 
   * Referência ao evento que será disparado:
   * 
   * \@sync-flow-datas: Sincronizar integração de dois workflows
   * 
   * \@gamification-action-log: Lidar com logs de ação em gamificação
   */
  name: '@sync-flow-datas' | '@gamification-action-log',
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
export const availableTimeToNotify : AvailableTimeToNotify[] = [8,9,10,11, 12, 13, 14, 15, 16, 17, 18]
export interface WorkflowConfigSlasType{
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
}
export interface WFConfigSlaNotifyType{
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
  to: '@creator' | '@owners' | '@flow_owner' | '@group_permission:n' | string,
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
    shortcuts: {
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
    }[]
  },
  triggers?: WorkflowTriggerType[],
  webhooks?: [],
  notifications?: WorkflowConfigNotificationType[],
  integrations?: {
    email?: {
      emailFrom?: string,
      host?: string,
      port?: number,
      auth?: { user: string, pass: string }
    },
    whatsapp?: { number: string, token: string },
    sms?: any,
    chatbot?: any,
    omie?: {
      secret_key: string,
      public_key: string
    }
    outhers?: {
      key: string,
      name: string,
      status: boolean,
      data: any
    }[]
  },
  services?: {
    auth?: WorkflowAuthType,
    autocomplete?: WorkflowConfigAutocomplete[],
    observers?: {
      onCreate?: WorkflowConfigObserverFnType[],
      onUpdate?: WorkflowConfigObserverFnType[],
      onDelete?: WorkflowConfigObserverFnType[]
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
         */
        request?: 'flow-datas' | 'steps' | 'me',
        auth?: AuthPublicRouteType,
        /**
         * Query Params disponíveis para pesquisa.
         * 
         * Record< [query-param] , [path-no-flow-data] >
         * 
         * Palavras reservadas: take, skip
         */
        available_query_params?: Record<string, string>,
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
        rule?:{
          available_steps?: string[],
          append_value?: Record<string, any>
        }
      }>,
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
  schema?: Record<string,FlowEntitySchemaInfo>,
  slas?: WorkflowConfigSlasType,
  routines?: WorkflowRoutinesType,
  owner?: {
    id?: string
    name: string,
    cnpj: string,
    email: string,
    whatsapp: string
  }
}
export type AuthPublicRouteType = AuthPublicRouteSimpleToken | AuthPublicRouteNetworkFlowAuth;
export interface AuthPublicRouteSimpleToken{
  /** Token criptografado e armazenado no FlowEntity */
  mode: "@simple-token",
  entity_key: string,
  props: {
    /** path do token dentro da entidade dinâmica */
    token: string
  }
}
export interface AuthPublicRouteNetworkFlowAuth{
  /** Usará o token do flowAuth de outro workflow */
  mode: "@network-flow-auth",
  flow_network_id: string,
  props: {
    /** path do id do flowAuth, dentro do wf atual */
    external_id: string
  }
}
export interface WorkflowSlaOutherField extends Omit<StepSlaType, 'stay'>{
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
  confirm?: StepActionConfirmType,
  /**
   * O que fazer em confirmação múltipla:
   * - individual-confirmation (default): Cada um terá sua confirmação separadamente 
   * - one-confirm-all: Ao confirmar a primeira, infere que todas as demais serão confirmadas
   */
  confirm_mode?: 'individual-confirmation' | 'one-confirm-all',
}
export interface WFActionFnCallTrigger{
  type: 'call-trigger',
  target: string,
}
export interface WFActionFnCallSingleEntity{
  type: 'call-single-entity',
  target: string,
}
export interface WFActionFnDownloadFiles{
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
   */
  fn?: WFCActionFnCallStep | WFCActionFnUpdateSelected | WFActionFnCallTrigger | WFActionFnCallSingleEntity | WFActionFnDownloadFiles
}
export interface ConfigPermissionType {
  groups: PermissionType[]
  actions: string[]
}
export interface WorkflowRoutinesType{
  view?: {
    title: string,
    icon?: AvailableIcons,
    permission: string,
  },
  executors: AvailableRoutinesExecutorsType[],
}
export const availableExecutorsTypes : (AvailableRoutinesExecutorsType['type'])[]= ['sync-ivrim-big-data']
export type AvailableRoutinesExecutorsType = WorkflowRoutinesExecutorIBD
interface WorkflowRoutinesExecutorBase{
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
export interface WorkflowRoutinesExecutorIBD extends WorkflowRoutinesExecutorBase{
  type: 'sync-ivrim-big-data'
  data?: WorkflowRoutinesExecutorIBDData
}
export interface WorkflowRoutinesExecutorIBDData{
  db_name: string,
  exception?: "duzani-theme",
  data?: {
    client_ivrim: string,
    cost_center: string
  }

}
export const availableIBDExeptions : (WorkflowRoutinesExecutorIBDData['exception'])[] = ["duzani-theme"]