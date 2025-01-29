import { ItemOrViewOrWidgetOrIntegration } from "."

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
export interface WidgetWorkerThreadQuery{
  type: 'in' | 'nin' | 'not' | 'text' | 'eq' | 'gte' | 'lte' | 'lt' | 'exists' | 'date' | 'not-exists-or-false',
  value?: any
}
export interface WidgetWorkerThread extends StepWidgetBaseType{
  type: 'widget-worker-thread',
  query?: Record<string, WidgetWorkerThreadQuery> | Record<'$or', Array<Record<string, WidgetWorkerThreadQuery>>>,
  query_secondary?: Record<string, WidgetWorkerThreadQuery> | Record<'$or', Array<Record<string, WidgetWorkerThreadQuery>>>,
  query_tertiary?: Record<string, WidgetWorkerThreadQuery> | Record<'$or', Array<Record<string, WidgetWorkerThreadQuery>>>,
  step_primary?: string,
  step_secondary?: string,
  origins?: string[],
  control_entity: {
    name: string,
    verification_parameter: string,
    /** 
     * Tempo máximo que a rotina pode ficar ligada.
     * 
     * Você pode usar essa configuração para que caso a aplicação seja encerrada
     * inesperadamente e não tenha atualizado o status para false, o status de ativo
     * perderá validade após um timeout.
     */
    timeout?: {
      /** Tempo em minutos em que a rotina pode ficar rodando */
      time: number,
      /** Campo que guardará a data de último inicio */
      ref: string
    }
  },
  effects?: {
    /** Nomear ações para serem chamadas na função */
    action?: string,
    condition?: string,
    append_values: Record<string, any>
  }[],
  items?: ItemOrViewOrWidgetOrIntegration[],
  exception?: 'ifm-roterization' | 'ifm-roterization-external' | 'ifm-anticipation',
  variation?: string
}
export type WidgetType = WidgetEmailType | WidgetWhatsappType | WidgetSmsType | WidgetChatBotType | WidgetRoutineType | WidgetWorkerThread;
export const widgetTypeFormatted : Record<WidgetType['type'], string>= {
  'widget-email': 'Email',
  'widget-whatsapp': 'Whatsapp',
  'widget-sms': 'SMS',
  'widget-chatbot': 'Chatbot',
  'widget-routine': 'Routine',
  'widget-worker-thread': 'Worker Thread'
};