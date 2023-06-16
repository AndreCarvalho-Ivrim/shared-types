import { WorkflowConfigType } from "./workflow.config.type";

export type AvailableWorkflowThemeType = 'Cobrança' | 'Comercial';
export type AvailableWorkflowStatusType = 'published' | 'edition';
export interface WorkflowType{
  _id: string,
  theme: AvailableWorkflowThemeType,
  created_at: string,
  date: string,
  title: string,
  description: string,
  user_id: string,
  user_name: string,
  status: AvailableWorkflowStatusType,
  config?: WorkflowConfigType
}