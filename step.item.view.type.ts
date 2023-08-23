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
  /** ID com shortcodes para replace
   * Exemplo:
   * id_1 = 8 | id_2 = 10
   * definição: @[id_1]/@[id_2]
   * resultado: 8/10
   * 
   * Também pode ser definido um valor padrão usando pipe(|)
   * * id_1 = undefined | id_2 = 10
   * definição: @[id_1|0]/@[id_2]
   * resultado: 0/10
   */
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