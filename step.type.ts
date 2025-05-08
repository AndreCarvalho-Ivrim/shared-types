import { AvailableWorkflowStatusType, ConfigViewModeColumnsType, ItemOrViewOrWidgetOrIntegration, StepActionConfirmType, StepActionType, StepTriggerType, TargetModeType, ThemeColorType, WorkflowConfigActionsType, WorkflowType } from "."
import { AvailableTriggerEffects } from "./workflow.config.triggers.type";

export type ExecuteDescriptionType = '@create' | '@update' | '@delete' | '@always';
export type ToastTypes = "success" | "info" | "warning" | "error"
export interface ToastSettingType{ type: ToastTypes, message: string }
export interface StepCustomRuleFind{
  id: '@find',
  data: {
    view_item: ConfigViewModeColumnsType[],
    /**
     * Onde será a pesquisa, nos flow-datas ou em entidades dinâmicas
     * - (default) flow-data
     * - entity: Se for entidade dinâmica é obrigatório informar o id, e é \
     * obrigatório usar ``` effects: { "redirect-and-autocomplete": ... } ``` \
     * para que o valor encontrado seja usado como autocomplete
     */
    mode?: 'flow-data' | 'entity',
    /** Id da entidade dinâmica. Usado apenas se mode === 'entity' */
    id?: string;
    toast?: {
      many_found?: ToastSettingType,
      found?: ToastSettingType,
      not_found?: ToastSettingType,
      /**
       * A chave do objeto switch é uma string condition, que se for dar match,
       * irá realizar o código retratado no valor
       */
      switch?: Record<string, ToastSettingType>
    }
  }
}
export interface StepCustomRuleCumulative{
  id: '@cumulative',
  /** { [cumulative-key]: ...definição } */
  data: Record<string, { mode: 'append' | 'prepend' }>
}
export interface StepCustomRuleSelectOwner{
  id: '@select-owner',
  data: {
    /**
     * Efeito colateral após atualização de owners:
     * - [reload-page]: Recarrega a página
     * - [reload-and-reopen]: Recarrega a página e abre novamente o flowData
     * - [update-current]: Faz request para atualizar dados do flowData atual
     * - [update-owners]: Usa a reposta da atualização para atualizar o flowData
     */
    effect?: 'reload-page' | 'reload-and-reopen' | 'update-current' | 'update-owners',

  }
}
export interface StepTypeRuleRedirect{
  condition: string, // String Conditional. Tem acesso aos helpers de data como: __@now(+4)__
  to: string,
  action_permission?: string,
  confirm?: StepActionConfirmType,
}
export type StepTypeRulesEffects = Partial<Record<(AvailableTriggerEffects | 'close-if-successful' | 'result-page' | 'redirect-and-autocomplete' | 'reload-and-open' | 'redirect-to-step-if-successful' | 'enable-flow-alert-listeners'), boolean | {
  condition?: string,
  [key: string]: any
} | Array<{ condition?: string, [key: string]: any }>> >
export interface StepCustomRuleRedirectToStep{
  /** Use \@current-step no target para redirecionar para o step atual do flow-data */
  id: '@redirect-to-step'
}
export interface StepCustomRuleRedirectToLink{
  /** Adicione o link no target */
  id: '@redirect-to-link',
  /** default: _blank */
  target?: '_blank' | '_self'
}
export interface StepCustomRuleFormWasModified{
  id: '@form-was-modified',
  /** Será usado caso o usuario tenha a opção de prosseguir mesmo sem modificações - não tem suporte para items */
  confirm?: Omit<StepActionConfirmType, 'StepItemType'>,
  /** Sera usado caso o usuario seja obrigado a fazer alguma modificação */
  error_message?: string
}
export interface StepTypeRules{
  /**
   * Está propriedade serve para forçar o preenchimento \
   * de campos especificos, mesmo não sendo required
   */
  requireds?: string[],
  /** 
   * Esta propriedade serve para força o não preenchimento de \
   * campos especificos
   */
  ignores?: string[],
  /** Ignora validação de formulário */
  redirect?: StepTypeRuleRedirect[],
  /**
   * Efeitos colaterais na interface após o envio da etapa
   * 
   * - [close-if-successful]: Fechar SlideOver se requisição bem sucedida
   * - [result-page]: Página de Resultado. Este efeito carrega uma variável de estado \
   * para ser renderizada em uma página de sucesso. Para funcionamento correto é necessário \
   * seguir a tipagem:
   * 
   * ```
   * "result-page": {
   *  // condition --ignorado
   *  variations: Array<{
   *    condition: string,
   *    // mensagem principal
   *    message: string,
   *    // Possui suporte a shortcodes
   *    subtitle?: string,
   *    type: "success" | "danger" | "warning" | "light" | "info"
   *  }>
   * }
   * ```
   * 
   * - [redirect-and-autocomplete]: Usado junto com a regra de step find, definindo que após encontrar \ 
   * ou não um registro, vai redirecionar para a etapa de destino ou para etapa especificada em [redirec...]: { target: string }, e usar o conteúdo encontrado apenas \
   * para autocomplete
   * 
   * - [redirect-to-step-if-successful]: Redirecionar para uma determinada etapa se a requisição for bem sucedida.
   * 
   * - [enable-flow-alert-listeners]: Ativa o listener de um ou mais alertas do workflow. Para este efeito é 
   * obrigatório informar a prop keys no objeto de configuração com a chave dos alerts que quer habilitar
   * */
  effects?: StepTypeRulesEffects,
  /**
   * Tipos de usuários que podem ser responsáveis pelo flow_data:
   *
   * - \@data_creator: Criador do flow data
   * -  \@current_user: Usuário atual se tornará o owner
   * - \@custom:x@[y]: Indicar grupo de permissão baseada em um dado do flow_data, com suporte a shortcodes
   * - \@custom-actions:x@[y]: Indicar ação baseada em um dado do flow_data, com suporte a shortcodes e \
   * separador por virgula p/ N ações
   * - string: Nome do grupo de permissões(ex. Financeiro), que o usuário deve ter para poder se tornar owner
   */
  owner?: ('@data_creator' | '@current_user' | '@flow_data:n' | string)[],
  /** Seguindo as mesmas regras de owner */
  can_change_owner?: ('@data_creator' | '@current_user' | '@flow_data:n' | string)[],
  sole_owner?: boolean,
  /** Configura permissões personalizadas de ações dentro desta etapa */
  actions?: Record<WorkflowConfigActionsType['id'], {
    group_permission?: ('@data_creator' | '@data_owner' | '@not-allowed' | string)[],
    permissionErroMessage?: string,
    [key: string]: any
  }>
  /**
   * AVAILABLE CUSTOM RULES
   * - [@find]: Utilizar o step para pesquisa. Ver tipagem de StepCustomRuleFind
   * - [@cumulative]: Usado para lidar com o modo de acumular os dados do StepType.cumulative_form_data \
   * em atualizações
   * - [@select-owner]: Utilizar o botão para chamar o modal de seleção de owners
   */
  customRules?: StepCustomRuleFind | StepCustomRuleCumulative | StepCustomRuleSelectOwner | StepCustomRuleRedirectToStep | StepCustomRuleFormWasModified | StepCustomRuleRedirectToLink,
  /**
   * STRC \
   * Os valores observados são os itens com observer: true e caso \
   * queira referência o flowData atual é necessário passar o code \
   * [$flow_data:] antes do nome da prop.
   */
  render?: string,
  /** Utilizado para ter o funcionamento de createOrUpdate baseado nos dados de cadastro. */
  update_if_match?: {
    match: string[],
    exception?: 'ability-check-dates',
    data?: any
  },
  badges?: BadgeType[]
}
export interface StepSlaType{
  /** Tempo esperado de permanência em uma etapa */
  stay: number,
  /** Unidade de medida. Default: **day** */
  unit?: 'day' | 'hour',
  /**
   * Controlar indicadores de cor, baseado em quanto tempo falta para cumprimento do sla.
   * 
   * A chave será a quantidade de dias exemplo: \
   * - "-1" (faltando um dia)
   * - "0"(no dia de vencimento)
   * - ">1" (qualquer número maior ou igual a um dia após vencimento)
   * - "<-2" (qualquer número menor ou igual a dois dias de antecendência)
   * 
   * O segundo parametro é a classe da cor especificada
   * 
   * Caso não seja informado seguirá a regra: <-2 = light | -1 = dark | 0 = warning | >1 = danger
   */
  color_indicators?: Record<string, 'danger' | 'warning' | 'info' | 'success' | 'dark' | 'light'>
  /**
   * Apartir de que número deseja mostrar o indicador numérico. Geralmente usado números negativos. \
   * Por padrão inicia em -1
   */
  show_after_from?: number
}
export interface StepType{
  version?: string,
  _id?: string,
  id: string,
  name: string,
  type: 'slide-over' | 'page',
  target_mode: TargetModeType,
  index: number,
  title?: string,
  is_selected?: boolean,
  position: { x: number, y: number },
  items?: ItemOrViewOrWidgetOrIntegration[],
  /**
   * Se não tiver rules.customRule[id]=\@cumulative, cada\
   * requisição irá sobrescrever a anterior
   */
  cumulative_form_data?: string[],
  target?: string,
  triggers?: StepTriggerType[]
  rules?: StepTypeRules,
  status?: AvailableWorkflowStatusType,
  is_stateless?: boolean,
  actions?: StepActionType[],
  action_button?: Omit<StepActionType, 'key' | 'target' | 'isRedirect'>,
  descriptions?: {
    execute: ExecuteDescriptionType,
    /** strc com adição da propriedade target, sendo o id(web-id) da etapa de destino */
    condition?: string,
    content: string
  }[],
  /** Válido apenas quando step.type === 'page' */
  page?: {
    step_links?: Array<{
      to: string,
      tooltip?: string,
      is_current?: boolean
    }>,
    classNames?: {
      /** SLIDEOVER quando a página é renderizada no Executer */
      slide?: {
        /** DIV que abraça todo conteúdo */
        wrapper?: string,
        /** DIV que abraça o corpo do slideover */
        container?: string,
      }
      /** DIV que abraça todo o conteúdo da etapa */
      wrapper?: string,
      /** FORM que contem os itens, os botões, e os select searcheds */
      form?: string,
      /** DIV que abraça apenas os itens */
      container?: string,
      /** Classe personalizada por item ```{ item-key: string }``` */
      items?: Record<string, {
        wrapper?: string,
        /** Apenas alguns itens, como o group collapse tem suporte ao container */
        container?: string,
        /** Válido apenas quando o item é do tipo table */
        tr?: string
      }>,
      footer?: {
        container?: string,
        buttons?: string
      }
    },
    /** Se true, irá adicionar um asterísco em todos campos obrigatórios */
    asterisk_when_required?: boolean
  }
  /** VALIDO APENAS P/ ETAPAS NÃO STATELESS */
  sla?: StepSlaType
}
export interface OptionalStepType extends Omit<StepType, 'name' | 'type' | 'position' | 'target_mode' | 'index'>{
  name?: string,
  type?: 'slide-over' | 'page',
  position?: { x: number, y: number },
  target_mode?: TargetModeType,
  index?: number
}
export interface StepDetailsProps{
  node: StepType,
  nodes?: StepType[],
  workflow: WorkflowType,
  onChangeNode: (param: OptionalStepType) => void,
  onConnect?: (params: OnConnectType) => void,
  onAddNode?: (autoConnect?: string, label?: string, isSecondaryAction?: boolean) => void,
  onClose?: () => void
}

export interface OnConnectType{
  source: string | null,
  sourceHandle: string | null,
  target: string | null,
  targetHandle: string | null,
  label?: string
}

export interface BadgeType{
  title: string,
  theme: ThemeColorType,
  condition: string,
  tooltip?: string
}