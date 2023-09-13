import { AvailableIcons } from "./icon.type";

export type FlowEntitySchemaTypes = "text" | "textarea" | "number" | "date" | "money" | "file-image" | "boolean";
export const availableFlowEntitySchema : FlowEntitySchemaTypes[] = ["text", "textarea", "number", "date", "money", "file-image", "boolean"];
export const availableFlowEntityMasks : Array<FlowEntitySchemaInfo['mask']> = ['email', 'cpf', 'cnpj', 'cpf-cnpj', 'cep', 'phone', 'url', 'whatsapp-md'];
export interface FlowEntitySubSchema{
  type: 'sub-schema',
  label: string,
  placeholder: string,
  schema: Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>
}
export interface FlowEntitySchemaInfo{
  type: FlowEntitySchemaTypes,
  label: string,
  placeholder?: string,
  mask?: 'email' | 'cpf' | 'cnpj' | 'cpf-cnpj' | 'cep' | 'phone' | 'url' | 'whatsapp-md' | 'image-url',
  required: boolean,
  unique?: boolean
  rule?: {
    format_str?: {
      replace?: [string, string],
      split?: { separator: string, splice?: number, revert?: boolean },
      trim?: boolean,
    }
  }
}
export interface FlowEntityAssociationColumns{
  name: string,
  update: boolean,
  columns: Record<string, string>
}
export interface FlowEntityImportSheet{
  association_columns: FlowEntityAssociationColumns[],
  can_add_associations?: boolean,
  restrictMode?: boolean
}
export interface FlowEntityInfo{
  title: string,
  icon?: AvailableIcons,
  description?: string,
  schema: FlowEntitySchemaTypes | FlowEntitySubSchema | Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>,
  permissions?: string | {
    create?: string,
    delete?: string,
    update?: string,
    select?: string
  },
  restrictMode?: boolean, // default = true
  created_at?: Date,
  importSheet?: FlowEntityImportSheet,
}