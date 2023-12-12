import { ShortUser } from ".";
import { AvailableIcons } from "./icon.type";
import { AvailableRegexUrls } from "./utils/routes";

export type DashboardModes = 'all' | 'selected';
export interface DashboardActionType{
  icon?: string,
  name: string,
  fn?: string,
  href?: string
}
export interface DashboardType{
  id: string,
  title: string,
  slug: string,
  mode: DashboardModes,
  description?: string,
  icon?: string,
  link: string,
  active: boolean,
  actions?: DashboardActionType[],
  menu?: DashboardMenuType,
  user_ids?: string[],
  users?: ShortUser[],
  updated_at: string,
  created_at: string
}
export interface DashboardAsideItems {
  id: string,
  href?: AvailableRegexUrls,
  icon?: AvailableIcons,
  name: string,
  items?: Omit<DashboardAsideItems, 'items'>[]
}
export interface DashboardMenuType{
  /** Qual o caminho para o item ativo do aside */
  active?: string | string[],
  items: DashboardAsideItems[]
}