import { StepItemType } from "../../step.item.field.type"
import { StepViewType } from "../../step.item.view.type"

export type AvailableEventStatus = 'Aberto' | 'Cancelado' | 'Em Andamento' | 'Encerrado';
export interface EventType{
  _id: string,
  name: string,
  status?: AvailableEventStatus,
  event_date: string, 
  form_title: string,
  form_description: string,
  form_image: string,
  footer_form_image: string,
  guests_accepted: boolean,
  max_guests?: number,
  receive_companies: boolean,
  schedules: {
    consumed_quotas: number,
    final_hour: string,
    initial_hour: string,
    quotas: number,
    unique_cpf: number
  }[],
  satisfaction_survey_id?: string,
  satisfaction_survey?: string,
  satisfaction_survey_sent?: boolean
}

type AvailableStatus =
  'Ag. Check-in'               | 'Check-in Parcial'    | 'Check-in Realizado' |
  'Ag. Pesquisa de Satisfação' | 'Pesquisa Respondida' |
  'Arquivado'

export interface FlowDataReservation{
  token: string,
  name: string,
  email: string,
  status: AvailableStatus,
  cpf: string,
  event_id: string,
  event_name: string,
  event_date: string,
  schedule: string,
  guests?: number,
  guest_check_in?: number,
  is_company: boolean,
  company_name?: string
  satisfaction_survey_send?: boolean
}

export interface SatisfactionSurveyType{
  _id: string,
  name: string,
  description: string,
  email_image: string,
  header_image: string,
  footer_image: string,
  status: 'Criada' | 'Associada a Eventos' | 'Pesquisa Ativa',
  fields: (StepItemType | StepViewType)[],
  linked_event?: { event_id: string, event_name: string }[]
}
export interface SurveyResponseType{
  _id: string,
  satisfaction_survey_id: string,
  flow_data_id: string,
  event_id: string,
  response: Record<string,any>
}