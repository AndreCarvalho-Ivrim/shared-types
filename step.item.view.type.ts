import { AvailableCustomItemModeType } from "./step.item.field.type";
import { IntegrationExcelColumnTypeType } from "./step.item.integration.type";

interface StepViewBaseType{
  key: string,
  mode: 'view',  
  label?: string,
  placeholder?: string
}
export type AvailableStepItemViewTypeType = 'table' | 'group-table' | 'description' | 'html';
export const availableStepItemViewTypeFormatted : Record<AvailableStepItemViewTypeType, string> = {
  table: 'Tabela',
  'group-table': 'Grupo de Tabelas',
  description: 'Descrição',
  html: 'Conteúdo Customizado'
};
export interface StepViewColumnType{
  id: string,
  name: string,
  type: IntegrationExcelColumnTypeType | 'file-multiple' | 'file' |  AvailableCustomItemModeType,
  required?: boolean
}
export type StepViewType = StepViewTableType | StepViewGroupTableType | StepViewDescriptionOrHtmlType;
export interface StepViewTableType extends StepViewBaseType{
  type: 'table',
  columns: StepViewColumnType[]
}
export interface StepViewGroupTableType extends StepViewBaseType{
  id: string,
  type: 'group-table',
  resume: StepViewColumnType[],
  columns: StepViewColumnType[]
}
export interface StepViewDescriptionOrHtmlType extends StepViewBaseType{
  type: 'description' | 'html',
  content: string,
  replacers?: string[],
  mask?: 'none' | 'alert-danger' | 'alert-info',
  rules?: {
    render?: string
  }
}