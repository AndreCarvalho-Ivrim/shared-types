import { StepTypeRules } from "./step.type"
import { StepItemType, ThemeColorType } from "./step.item.field.type"

export interface StepActionType{
  label: string,
  type: ThemeColorType,
  key: string,
  target: string,
  /** Se adicionar \@condition: pode inserir uma string-condition */
  action_permission?: string,
  isRedirect?: boolean,
  confirm?: StepActionConfirmType,
  rules?: StepTypeRules,
  /**
   * { [key]: ...definições }
   * 
   * Se a key = \@owner irá alterar o owner do flow-data. E se o \
   * valor for \@me irá atribuir o usuário atual como owner
   */
  append_values?: Record<string, {
    only_next_step?: boolean,
    value: any
  }>
}
export interface StepActionConfirmType{
  title: string,
  description?: string,
  rules?: StepTypeRules,
  items?: StepItemType[],
  actions: [StepActionTypeOmittedConfirmAndTarget, StepActionTypeOmittedConfirmAndTarget]
}
export interface StepActionTypeOmittedConfirmAndTarget extends Omit<StepActionType,'confirm' | 'target' | 'action_permission'>{
  confirmation: boolean
}
export interface StepTriggerType{
  name: string,
  target: string,
  condition: string
}