import { FlowEntitySchemaInfo, FlowEntitySchemaTypes, FlowEntitySubSchema, IntegrationExcelColumnTypeType, PermissionType, StepActionConfirmType } from "."

export type AvailableServicesType = 'email' | 'whatsapp' | 'sms' | 'chatbot';
export type AvailableViewModeType = 'table' | 'dashboard';
export type WorkflowConfigFilterRefType = '@user.name' | '@user.email' | '@owner.name' | '@owner.email' | '@created_at' | '@step_id' | string
export interface WorkflowConfigFilterType {
  name: string,
  type: 'text' | 'date' | 'select' | 'list',
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
export interface WorkflowConfigObserverFnType{
  /** EVENTS -> available names on type event
   * @revalidate-when-updated-product: Evento de revalidação de estoque na estrutura do WF Duzani
   */
  name: string,
  type: 'append' | 'backup' | 'event',
  execute: 'before' | 'after',
  condition?: string,
  unique?: boolean,
  value?: string,
}
export interface ConfigViewModeColumnsType{
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
export interface WorkflowAuthType {
  props: {
    email: string,
    name: string,

    link?: string,
    template?: WorkflowAuthTemplateType[]
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
export interface WorkflowConfigType {
  actions?: WorkflowConfigActionsType[],
  view_modes?: WorkflowViewModeTable[],
  filters?: Record<string, WorkflowConfigFilterType[]>,
  permissions?: ConfigPermissionType,
  triggers?: [],
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
        schema?: FlowEntitySchemaTypes | FlowEntitySubSchema | Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>,
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
export interface WFCActionFnCallStep{
  type: 'call-step',
  target: string
}
export interface WFCActionFnUpdateSelected{
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
export interface WorkflowConfigActionsType{
  icon?: 'new' | 'delete' , /* [obsoletos]: | 'update' | 'alarm' | 'search' | 'models' */
  /** Os ids pré-definidos possuem funções e comportamentos pré-definidos
   * 
   * start-flow: 
   *  - Chama a execução da primeira etapa do fluxo
   *  - É renderizado no topo da página
   * 
   * delete-data:
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
  fn?: WFCActionFnCallStep | WFCActionFnUpdateSelected
}
export interface ConfigPermissionType {
  groups: PermissionType[]
  actions: string[]
}