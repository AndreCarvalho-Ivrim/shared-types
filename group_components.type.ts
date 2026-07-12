import { StepItemType, StepViewType } from "../types";
export type GroupComponentsItemsType =  StepItemType | StepViewType;
export interface IGroupComponents {
  _id?: string,
  name: string,
  flow_id: string,
  items: (StepItemType | StepViewType)[],
  created_at?: Date,
  updated_at?: Date
}