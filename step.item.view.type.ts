import { IntegrationExcelColumnType } from "./step.item.integration.type";

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

export type StepViewType = StepViewTableType | StepViewGroupTableType | StepViewDescriptionOrHtmlType;
export interface StepViewTableType extends StepViewBaseType{
  type: 'table',
  columns: IntegrationExcelColumnType[]
}
export interface StepViewGroupTableType extends StepViewBaseType{
  id: string,
  type: 'group-table',
  resume: IntegrationExcelColumnType[],
  columns: IntegrationExcelColumnType[]
}
export interface StepViewDescriptionOrHtmlType extends StepViewBaseType{
  type: 'description' | 'html',
  content: string
}