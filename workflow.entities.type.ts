export type FlowEntitySchemaTypes = "text" | "number" | "date" | "money" | "file-image" | "boolean";
export interface FlowEntitySubSchema{
  type: 'sub-schema',
  label: string,
  placeholder: string,
  schema: Record<string, (FlowEntitySubSchema | FlowEntitySchemaInfo)>
}
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
  schema: FlowEntitySchemaTypes | FlowEntitySubSchema | Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>,
  permissions?: string | {
    create?: string,
    delete?: string,
    update?: string,
    select?: string
  },
  created_at?: Date
}