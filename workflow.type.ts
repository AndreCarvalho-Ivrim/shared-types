import { NotificationPreferenceByType, NotificationPreferenceType } from "./notification.type";
import { WorkflowConfigType } from "./workflow.config.type";

export type AvailableWorkflowThemeType = 'Cobrança' | 'Comercial' | 'Financeiro' | 'Gamificação';
export const availableWorkflowTypes : AvailableWorkflowThemeType[] = ['Cobrança','Comercial', 'Financeiro', 'Gamificação']; 

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
  template?: string,
  template_params?: any,
  hidden?: boolean,
  resume?: {
    permissions?: WorkflowConfigType['permissions'],
    integrations?: { email?: boolean, chatbot?: boolean, sms?: boolean, whatsapp?: boolean },
    auth: boolean
  },
  hidden?: boolean
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