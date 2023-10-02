import { FlowEntitySchemaInfo, FlowEntitySchemaTypes, FlowEntitySubSchema, IntegrationExcelColumnTypeType, PermissionType, StepActionConfirmType } from "."
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
   * - list: Lista de opções (in)
   */
  type: 'text' | 'select' | 'date' | 'list',
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
   */
  value?: string,
  /** EVENTS -> required data on events[\@search-and-fill-data-with-match, \@fill-additional-data-with-match]
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
   */
  data?: any
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
export interface WorkflowViewModeTable {
  view_mode: 'table',
  title: string,
  icon?: AvailableIcons,
  slug: string,
  columns: ConfigViewModeColumnsType[],
  order_by?: { ref: string, orientation?: 'desc' | 'asc' },
  /** 
   * Existem alguns valores pré-definidos que geram pesquisas mais complexas como:
   * - \@array-exists-and-gt-0: { "key": { $exists: true, $not: { $size: 0 } } }
   * - \@array-not-exists-or-eq-0: { $or: [{ "key": { $exists: false } }, { "key": { $size: 0 } }]}
   */
  filter?: Record<string, string>,
  /** Caso essa opção seja configurada, ele redefinirá o comportamento padrão de redirecionamento
   *  de steps. Ou seja, quando clicar em um flowData na tabela, em vez de abrir o step atual, ele abrirá
   *  para o definido abaixo, e o mesmo se aplica após o envio do submit, que ele sempre redirecionará o
   *  usuário para o step abaixo, a não ser se o target for um stateless_step
   */
  redirect_to_stateless_step?: string
}
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
export interface WorkflowTriggerType{
  /** Referência interna */
  id: string,
  /** Referência ao evento que será disparado */
  name: string,
  title: string,
  /** Se o evento será feito em segundo plano ou se terá resposta imediata */
  is_async: boolean,
  /** Dados adicionais */
  data: any,
  /**
   * ```{ "onload-to-fill-the-page-if-necessary": true }``` \
   * Atualizar dados da visualização, se não tiver com a tabela preenchida
   * 
   * ```
   *  {
   *    // Todos valores visualizados nessa função estão dentro do resultAndResponse.data
   *    "success-message": {
   *      "condition": "--string-conditional--",
   *      // Tem suporte a valores dinâmicos da resposta com \@[]
   *      "response": ["--se-verdadeiro--", "--se-falso--"],
   *    }
   *  }
   * ```
   * Formatar a mensagem de resposta
   */
  effects: Record<string, any>[]
}
export interface WorkflowConfigType {
  actions?: WorkflowConfigActionsType[],
  view_modes?: WorkflowViewModeTable[],
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
    chatbot?: any
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
        body: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>
      }>,
      post?: Record<string, {
        scope?: string,
        body: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>,
        mode: 'merge' | 'overwrite',
        schema?: Record<string, FlowEntitySchemaInfo>,
      }>,
    }
  }
  schema?: Record<string,FlowEntitySchemaInfo>,
  owner?: {
    id?: string
    name: string,
    cnpj: string,
    email: string,
    whatsapp: string
  }
}
export type WFCActionRenderIn = 'top' | 'filter-bar'
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
  action_permission?: string,
  available_view_modes?: string[],
  render?: {
    in: WFCActionRenderIn,
    condition?: '@when-selected-items' | string
  },
  fn?: WFCActionFnCallStep | WFCActionFnUpdateSelected | WFActionFnCallTrigger
}
export interface ConfigPermissionType {
  groups: PermissionType[]
  actions: string[]
}