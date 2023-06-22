import { AvailableWorkflowStatusType, ItemOrViewOrWidgetOrIntegration, StepActionConfirmType, StepActionType, StepTriggerType, TargetModeType, ThemeColorType, WorkflowType } from "."

export interface StepTypeRules{
  requireds: string[],
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
  cumulativeFormData?: string,
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