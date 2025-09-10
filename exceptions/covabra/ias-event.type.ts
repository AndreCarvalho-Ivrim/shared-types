export interface EventType{
  _id: string,
  name: string,
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
  }[]
}

type AvailableStatus =
  'Ag. Check-in'               | 'Check-in Parcial' | 'Check-in Realizado' |
  'Ag. Pesquisa de Satisfação' | 'Pesquisa Respondida' |
  'Arquivado'

export interface FlowDataReservation{
  token: string,
  name: string,
  email: string,
  status: AvailableStatus,
  cpf: string,
  event_name: string,
  schedule: string,
  guests?: number,
  guest_check_in?: number,
  is_company: boolean,
  company_name?: string
}
