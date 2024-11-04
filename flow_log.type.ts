export type FlowLogTypes = 'webhook' | 'observer-event' | 'routine-event' | 'widget-event' | 'public-routes';
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
  description: string
}

export const availableFlowLogTypes : CardFlowLog[] = [
  {
    type: 'webhook',
    title: 'Webhook',
    description: 'Logs de processos automatizados.'
  }, {
    type: 'public-routes',
    title: 'Rotas Públicas',
    description: 'Logs de rotas públicas.'
  }, {
    type: 'routine-event',
    title: 'Rotina de Eventos',
    description: 'Logs de rotinas de eventos.'
  }, {
    type: 'widget-event',
    title: 'Worker Thread',
    description: 'Logs de tarefas em segundo plano.'
  }, {
    type: 'observer-event',
    title: 'Observador de Eventos',
    description: 'Logs de observadores de eventos.'
  }
];