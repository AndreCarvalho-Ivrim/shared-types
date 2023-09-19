import { AvailableIcons } from "./icon.type";

export type NotificationToType = 'broadcast_hub' | 'broadcast' | 'broadcast_flow_auth' | 'hub_perms' | 'flow_perms' | 'hub_ids' | 'flow_auth_ids';
export type NotificationTypeType = 'update' | 'mention' | 'alert' | 'reminder' | 'license';
export const availableNotificationType : NotificationTypeType[] = ['alert','license','mention','reminder','update']
export const availableNotificationTypeFormatted : Record<NotificationTypeType, string> = {
  alert: 'Alertas',
  license: 'Licensa',
  mention: 'Menções',
  reminder: 'Lembretes',
  update: 'Atualizações'
}

export interface NotificationType{
  id: string,
  title: string,
  type: NotificationTypeType,
  icon?: AvailableIcons,
  description: string,
  to: NotificationToType,
  notification_group_id?: string,
  viewed?: boolean,
  schedule?: Date,
  user_id: string,
  client_id?: string,
  flow_id?: string,
  redirect_to?: string,
  template_id?: string,
  template_data?: string,
  is_archived?: boolean,
  notify_by: string,
  error_notify?: string,
  is_sended?: boolean,
  priority?: number,
  owner_id?: string,
  is_hub?: boolean,
}