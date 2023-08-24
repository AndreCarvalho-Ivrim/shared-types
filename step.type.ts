import { AvailableWorkflowStatusType, ItemOrViewOrWidgetOrIntegration, StepActionConfirmType, StepActionType, StepTriggerType, TargetModeType, ThemeColorType, WorkflowConfigActionsType, WorkflowType } from "."

export type ExecuteDescriptionType = '@create' | '@update' | '@delete' | '@always';
export interface StepTypeRules{
  requireds?: string[],
  redirect?: {
    condition: string, // String Conditional. Tem acesso aos helpers de data como: __@now(+4)__
    to: string,
    action_permission?: string,
    confirm?: StepActionConfirmType
  }[],
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
  customRules?: string
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
  cumulativeFormData?: string[],
  target?: string,
  actions?: StepActionType[],
  triggers?: StepTriggerType[]
  rules?: StepTypeRules,
  status?: AvailableWorkflowStatusType,
  action_button?: {
    label: string,
    type: ThemeColorType,
    action_permission?: string,
    confirm?: StepActionConfirmType
  }
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