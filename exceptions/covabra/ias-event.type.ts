export interface EventType{
  _id: string,
  name: string,
  event_date: string, 
  form_title: string,
  form_description: string,
  form_image: string,
  footer_form_image: string,
  guests_accepted: boolean,
  schedules: {
    consumed_quotas: number,
    final_hour: string,
    initial_hour: string,
    quotas: number,
  }[]
}