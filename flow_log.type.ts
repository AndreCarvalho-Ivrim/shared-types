import { AvailableIcons } from "./icon.type";

export type FlowLogTypes = 'webhook' | 'observer-event' | 'routine-event' | 'widget-event' | 'public-routes' | 'chatbot';
export type FlowLogStatus = 'successfully' | 'failed' | 'warning';

export interface FlowDataLog {
  status: FlowLogStatus;
  description: string;
  amount?: number;
  data?: Record<string, any>
  created_at: Date;
}
export interface FlowLogType{
  _id?: string,
  flow_id: string;
  title?: string;
  status: FlowLogStatus;
  type: FlowLogTypes;
  logs?: FlowDataLog[];
  started_at: Date;
  finished_at: Date;
}
export interface CardFlowLog {
  type: FlowLogTypes,
  title: string,
  description: string,
  icon?: AvailableIcons
}

export const translateFlowLogTypes : Record<FlowLogTypes, string> = {
  'webhook': 'Webhooks',
  'public-routes': 'Rotas Públicas',
  'routine-event': 'Rotinas',
  'widget-event': 'Worker Threads',
  'observer-event': 'Observadores',
  'chatbot': 'Chatbot',
}
export const translateStatusFlowLogTypes : Record<FlowLogStatus, string> = {
  'successfully': 'Sucesso',
  'failed': 'Falha',
  'warning': 'Alerta'
}
export const availableFlowLogTypes : CardFlowLog[] = [
  {
    type: 'webhook',
    title: translateFlowLogTypes['webhook'],
    description: 'Logs de webhooks de API.',
    icon: 'GitCompareIcon'
  }, {
    type: 'public-routes',
    title: translateFlowLogTypes['public-routes'],
    description: 'Logs de rotas públicas.',
    icon: 'WorldIcon'
  }, {
    type: 'routine-event',
    title: translateFlowLogTypes['routine-event'],
    description: 'Logs de eventos de rotinas.',
    icon: 'StopWatchIcon'
  }, {
    type: 'widget-event',
    title: translateFlowLogTypes['widget-event'],
    description: 'Logs de tarefas em segundo plano.',
    icon: 'CopyIcon'
  }, {
    type: 'observer-event',
    title: translateFlowLogTypes['observer-event'],
    description: 'Logs de eventos de observadores.',
    icon: 'BullseyeIcon'
  }
];