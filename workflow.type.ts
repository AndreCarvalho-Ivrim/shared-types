import { NotificationPreferenceByType, NotificationPreferenceType } from "./notification.type";
import { WorkflowConfigType } from "./workflow.config.type";

export type AvailableWorkflowThemeType = 'Cobrança' | 'Comercial' | 'Financeiro';
export const availableWorkflowTypes : AvailableWorkflowThemeType[] = ['Cobrança','Comercial', 'Financeiro']; 

export type AvailableWorkflowStatusType = 'published' | 'edition';
export const availableWorkflowStatus : AvailableWorkflowStatusType[] = ['published', 'edition'];
export const availableWorkflowStatusFormatted = {
  published: 'Publicado', edition: 'Em Edição'
}
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
  config?: WorkflowConfigType,
  resume?: {
    permissions?: WorkflowConfigType['permissions'],
    integrations?: { email?: boolean, chatbot?: boolean, sms?: boolean, whatsapp?: boolean },
    auth: boolean
  }
}
export interface SimpleFlowAuthPreferenceType extends NotificationPreferenceByType{
  is_archived?: boolean
}
export interface SimpleFlowAuthType{
  _id: string,
  name: string
  picture?: string
  auth_email: string
  whatsapp?: string
  sms?: string
  email?: string,
  preference?: SimpleFlowAuthPreferenceType[]
}