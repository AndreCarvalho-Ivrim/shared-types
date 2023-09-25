import { AvailableIcons } from "./icon.type";
import { WorkflowConfigObserverFnType } from "./workflow.config.type";

export type FlowEntitySchemaTypes = "text" | "textarea" | "number" | "date" | "money" | "file-image" | "boolean" | "select";
export const availableFlowEntitySchema : FlowEntitySchemaTypes[] = ["text", "textarea", "number", "date", "money", "file-image", "boolean", "select"];
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
  options?: { value: string, name: string }[],
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
  restrictMode?: boolean,
  /**
   * Se os registros serão adicionados no inicio ou no final. \
   * Por padrão é append(final)
   */
  insert_mode?: 'append' | 'prepend'
}
export interface FlowEntityInfo{
  title: string,
  icon?: AvailableIcons,
  description?: string,
  schema: FlowEntitySchemaTypes | FlowEntitySubSchema | Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>,
  rules?: {
    duplicity?: {
      /**
       * O id só deve ser preenchido caso queira usar a regra em
       * um sub-schema
       */
      id?: string,
      match: string[],
      /**
       * Se adicionar o ? antes da string, o campo só \
       * será sobrescrito, se for um campo válido. Exemplo:
       * 
       * ["?name", "surname"]
       * - Neste caso o [name] só será substituido se for válido
       * - O [surname] sempre será substituido
       */
      replacers?: string[],
      mode: 'merge' | 'overwrite' | 'replacer',
      /**
       * Caso exista regra de duplicidade, e o [on] não for passado,  \
       * a regra será aplicada para importação e criação individual, \
       * solucionando o conflito com o [mode]. \
       * Caso o on seja passado, a regra de duplicidade será aplicada \
       * apenas para o caso incluso no on. Neste caso, se o [restrictMode] \
       * for true, retornará erro no dado que não estiver incluso no on \
       * caso contrário, apenas irá ignorar
       */
      on?: ('create' | 'import')[]
    },
    flags?: Record<string, {
      condition: string,
      message: string
    }>
  },
  observers?: {
    /** 
     * O onMultiple serve para otimizar a performance dos outros observadores \
     * quando é enviado um cadastro multiplo, dessa forma, aglomerando os dados \
     * e enviando-os simultaneamente para serem tratados. 
     * 
     * Porém, ele possui algumas restrições:
     *
     * - Se adicionar o observer onMultiple, nos cadastros/atualizações \
     * em massa(importação) o onCreate-after e o onUpdate-after serão ignorados \
     * para que seja executado apenas ele.
     * - Ele não tem suporte ao type=append
     * - Ele não tem suporte ao execute=before
     */
    onMultiple?: WorkflowConfigObserverFnType[],
    onCreate?: WorkflowConfigObserverFnType[],
    onUpdate?: WorkflowConfigObserverFnType[],
    onDelete?: WorkflowConfigObserverFnType[],
  },
  permissions?: string | {
    create?: string,
    delete?: string,
    update?: string,
    select?: string
  },
  /** default = true */
  restrictMode?: boolean,
  created_at?: Date,
  importSheet?: FlowEntityImportSheet,
}