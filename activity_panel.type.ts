import { AvailableIcons } from "./icon.type"

export interface ActivityPanelBadge{
  type: 'warning' | 'info' | 'danger' | 'success' | 'primary' | 'light',
  value: number
}
export interface ActivityPanelFn{
  type: 'request',
  url: string,
  effects: Array<{
    /** always (default) */
    only?: 'success' | 'fail' | 'always',
    condition?: string,
    replace: {
      active?: boolean,
      /** Se for string, deve ser um shortcode \@[] */
      badge_value: string | number,
      badge_type: ActivityPanelBadge['type']
    },
    breakExec?: boolean
  }>
}
export interface ActivityPanelType{
  id: string,
  client_id : string,
  avatar?: string,
  icon?: AvailableIcons,
  title : string,
  description : string,
  redirect_to : string,
  for_the_client_id?: string,
  badge?: ActivityPanelBadge,
  active : boolean,
  fn : ActivityPanelFn,
  mode?: 'workflow-activity'
}