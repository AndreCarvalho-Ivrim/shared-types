interface StepWidgetBaseType{
  key: string,
  mode: 'widget',  
  label?: string,
  placeholder?: string,
  required?: boolean
}
export interface WidgetEmailType extends StepWidgetBaseType{
  type: 'widget-email',
  template_id: string,
  params: Record<string, string>, // template.params[N].id => $key(flowData)
  matchs: Record<string, string>, // template.matchs[N].id => $key(flowData)
}
export interface WidgetWhatsappType extends StepWidgetBaseType{
  type: 'widget-whatsapp',
  template_id: string
}
export interface WidgetSmsType extends StepWidgetBaseType{
  type: 'widget-sms',
  template_id: string
}
export interface WidgetChatBotType extends StepWidgetBaseType{
  type: 'widget-chatbot',  
}
export interface WidgetRoutineType extends StepWidgetBaseType{
  type: 'widget-routine',
  matchs: string[]
}
export type WidgetType = WidgetEmailType | WidgetWhatsappType | WidgetSmsType | WidgetChatBotType | WidgetRoutineType;
export const widgetTypeFormatted : Record<WidgetType['type'], string>= {
  'widget-email': 'Email',
  'widget-whatsapp': 'Whatsapp',
  'widget-sms': 'SMS',
  'widget-chatbot': 'Chatbot',
  'widget-routine': 'Routine'
};