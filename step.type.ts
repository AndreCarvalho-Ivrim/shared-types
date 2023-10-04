import { AvailableTriggerEffects, AvailableWorkflowStatusType, ConfigViewModeColumnsType, ItemOrViewOrWidgetOrIntegration, StepActionConfirmType, StepActionType, StepTriggerType, TargetModeType, ThemeColorType, WorkflowConfigActionsType, WorkflowType } from "."

export type ExecuteDescriptionType = '@create' | '@update' | '@delete' | '@always';
export type ToastTypes = "success" | "info" | "warning" | "error"
export interface ToastSettingType{ type: ToastTypes, message: string }
export interface StepCustomRuleFind{
  id: '@find',
  data: {
    view_item: ConfigViewModeColumnsType[],
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
export interface StepTypeRules{
  requireds?: string[],
  ignores?: string[],
  redirect?: {
    condition: string, // String Conditional. Tem acesso aos helpers de data como: __@now(+4)__
    to: string,
    action_permission?: string,
    confirm?: StepActionConfirmType,
  }[],
  /**
   * Efeitos colaterais na interface após o envio da etapa
   * 
   * - [close-if-successful]: Fechar SlideOver se requisição bem sucedida
   * */
  effects?: Partial<Record<AvailableTriggerEffects | 'close-if-successful', boolean | {
    condition: string,
    [key: string]: any
  }>>,
  owner?: ('@data_creator' | '@current_user' | string)[],
  /**
   * TIPOS DE USUÁRIOS QUE PODEM SER RESPONSÁVEIS PELO FLOW_DATA (
   *   @data_creator: Criador do flow data
   *   @current_user: Usuário atual se tornará o owner
   *   string: Nome do grupo de permissões(ex. Financeiro), que o usuário deve ter para poder se tornar owner
   */ 
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
   */
  customRules?: StepCustomRuleFind | StepCustomRuleCumulative | { id: string, data: any },
  render?: string
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
    condition?: string,
    content: string
  }[]
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