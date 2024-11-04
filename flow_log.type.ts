export type FlowLogTypes = 'webhook' | 'observer-event' | 'routine-event' | 'widget-event' | 'public-routes';
export type FlowLogStatus = 'successfully' | 'failed' | 'warning';

export interface FlowDataLog {
  status: FlowLogStatus;
  description: string;
  amount?: number;
  data?: Record<string, string>
  created_at: Date;
}
export interface FlowLogType{
  flow_id: string;
  title?: string;
  status: FlowLogStatus;
  type: FlowLogTypes;
  logs?: FlowDataLog[];
  started_at: Date;
  finished_at: Date;
}