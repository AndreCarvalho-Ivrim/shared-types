export type FlowEntitySchemaTypes = "text" | "number" | "date";
export interface FlowEntitySchemaInfo{
  type: FlowEntitySchemaTypes,
  label: string,
  placeholder?: string,
  mask?: string,
  required: boolean,
  unique?: boolean
}
export interface FlowEntityInfo{
  title: string,
  description?: string,
  schema: FlowEntitySchemaTypes | Record<string, FlowEntitySchemaInfo>,
  permissions?: string | {
    create?: string,
    delete?: string,
    update?: string,
    select?: string
  },
  created_at?: Date
}