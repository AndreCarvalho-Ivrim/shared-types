import { NotificationPreferenceByType } from "./notification.type";
import { WorkflowConfigType } from "./workflow.config.type";

export type AvailableWorkflowThemeType = 'Cobrança' | 'Comercial' | 'Financeiro' | 'Gamificação' | 'Supply' | 'Field Management' | 'Gestão' | 'Administrativo' | 'Matriz';
const objAvailableWorkflowTypes : Record<AvailableWorkflowThemeType, true> = {
  'Cobrança': true,
  'Comercial': true,
  'Financeiro': true,
  'Gamificação': true,
  'Supply': true,
  'Field Management': true,
  'Gestão': true,
  'Administrativo': true,
  'Matriz': true
};
export const availableWorkflowTypes = Object.keys(objAvailableWorkflowTypes) as AvailableWorkflowThemeType[];

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
  index?: number,
  user_id: string,
  payment_status?: 'up-to-date' | 'expired',
  active: boolean,
  hidden?: boolean,
  restrict?: boolean,
  user_name: string,
  status: AvailableWorkflowStatusType,
  config?: WorkflowConfigType,
  template?: string,
  template_params?: any,
  resume?: {
    permissions?: WorkflowConfigType['permissions'],
    integrations?: { email?: boolean, chatbot?: boolean, sms?: boolean, whatsapp?: boolean },
    auth: boolean
  },
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