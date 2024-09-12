import { AvailableIcons } from "./icon.type";
import { ConfigViewModeColumnsType, WorkflowConfigObserverFnType } from "./workflow.config.type";

export type FlowEntitySchemaTypes = "text" | "textarea" | "number" | "date" | "money" | "file" | "file-image" | "boolean" | "select" | "select-multiple" | "any" | "custom" | 'time';
export const availableFlowEntitySchema : FlowEntitySchemaTypes[] = ["text", "textarea", "number", "date", "money", "file", "file-image", "boolean", "select", "select-multiple", "any"];
export const availableFlowEntityMasks : Array<FlowEntitySchemaInfo['mask']> = ['email', 'cpf', 'cnpj', 'cpf-cnpj', 'cep', 'phone', 'url', 'whatsapp-md'];
export interface FlowEntitySubSchema{
  type: 'sub-schema',
  label: string,
  placeholder: string,
  schema: Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>,
  required?: boolean
}
export interface FlowEntitySchemaInfo{
  type: FlowEntitySchemaTypes,
  label: string,
  placeholder?: string,
  /**
   * Funcionalidades especificas de mascara:
   * - [whatsapp-md]: Lida com os padrões de formatação do whatsapp, \
   * e na tela de criação habilita a função preview
   * - [access-token]: Encripta o valor armazenado, ocultoo valor no \
   * front-end, e não permite atualização, apenas sobreescrita. Além \
   * de ter recursos de geração de token automática
   */
  mask?: 'email' | 'cpf' | 'cnpj' | 'cpf-cnpj' | 'cep' | 'phone' | 'url' | 'whatsapp-md' | 'image-url' | 'hidden' | 'iframe' | 'access-token',
  options?: { value: string, name: string }[],
  autocomplete?: {
    /** Se iniciar com @ está se referindo alguma função hardcode, e não do WF Entities */ 
    name: string, 
    /** autocomplete.response => field to fill */
    toFill?: Record<string, string>,
    trigger?: { mode: 'keyup' } | {
      mode: 'clickToNext',
      target: string
    }
  }
  required: boolean,
  unique?: boolean
  rule?: {
    format_str?: {
      replace?: [string, string],
      split?: { separator: string, splice?: number, revert?: boolean },
      trim?: boolean,
    },
    /**
     * default = overwrite
     * 
     * Para utilizar o merge em campos de texto ou numéricos é obrigatório \
     * enviar um string onde os dois primeiros caracteres = ++
     * 
     * ```
     * <valor-armazenado>: "hello"
     * 
     * <novo-valor>: "++ world"
     * 
     * <valor-final>: "hello world"
     * ```
     */ 
    conflit?: 'overwrite' | 'merge'
  },
  customData?: StepItemCustomListDraggable | {
    mode: '@list-draggable',
    settings?: any
  },
  rules?: {
    render?: string,
    min?: number
  },
  observer?: boolean
}
export interface FlowEntityAssociationColumns{
  name: string,
  update: boolean,
  /**
   * entity-col-key: excel-col-name 
   */
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
export interface FlowEntityExportDatas{
  title: string,
  omit_columns?: Array<string>
}
export interface FlowEntityViewModeGrid{
  type: 'grid',
  className?: string,
  resume: {
    picture: string,
    title: string,
    content: ConfigViewModeColumnsType[]
  }
}
export type AvailableFlowEntityViewModes = FlowEntityViewModeGrid
export interface FlowEntityInfo{
  title: string,
  icon?: AvailableIcons,
  description?: string,
  schema: FlowEntitySchemaTypes | FlowEntitySubSchema | Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>,
  view_mode?: AvailableFlowEntityViewModes,
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
    }>,
    single?: boolean
  },
  /** Se tiver habilitado, os dados serão salvos separadamente na tabela flowEntityData */
  has_extensive_data?: boolean,
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
  exportDatas?: Array<FlowEntityExportDatas>,
  publicRoutes?: {
    post?: Record<string, {
      /** Escopo de alteração dentro do objeto flow_data.data */
      scope?: string,
      /** Se não for informado trará o flow_data.data completo */
      body?: Record<'__extends' | '__omit' | '__cumulative' | string, string | string[]>,
      /** 
       * É utilizado apenas quando a requisição inclui find.
       * 
       * - [merge] Mascla os dados com o do registro encontrado
       * - [overwrite] Sobrescreve os dados do registro encontrado
       */
      mode?: 'merge' | 'overwrite',
      /** Se for true, desabilita a funcionalidade find */
      only_creation?: boolean,
      schema?: Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>
    }>
  },
}

export interface StepItemCustomListDraggable{
  mode: '@list-draggable',
  settings: {
    /** Título que aparecerá no modal */
    title?: string,
    initial_value?: Record<string, any>[]
  }
}

export interface ExternalRequestSchema{
  name: string,
  type: FlowEntitySchemaTypes,
  required?: boolean
}