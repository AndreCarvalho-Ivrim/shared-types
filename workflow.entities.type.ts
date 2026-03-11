import { AvailableIcons } from "./icon.type";
import { StepItemAttrMaskDynamicType, StepItemAttrMaskStringType } from "./step.item.field.type";
import { StepViewAttrMaskType } from "./step.item.view.type";
import { WorkflowConfigFilterRefType, WorkflowConfigFilterType, WorkflowConfigObserverFnType, WorkflowViewModeDashboardModuleBlock } from "./workflow.config.type";

interface FlowEntityDataFilters {
  "_key"?: string,
  /**
  * Indica se a consulta deve usar collation para ignorar acentuação e diferenças de caixa.
  * Quando true, aplica collation com locale 'pt' e strength 1, permitindo que buscas
  * como "joao" encontrem "João", "JOAO", etc.
  */
  is_collation?: boolean
  query?: {
    ref: WorkflowConfigFilterRefType | WorkflowConfigFilterRefType[],
    type: WorkflowConfigFilterType['type'],
    value: any,
    without_accentuation?: boolean,
    group?: 'and' | 'or'
  }[]
}
export type FlowEntitySchemaTypes = "text" | "textarea" | "number" | "date" | "money" | "file" | "file-image" | "boolean" | "select" | "select-multiple" | "any" | "custom" | 'time' | 'file-multiple';
export const availableFlowEntitySchema : FlowEntitySchemaTypes[] = ["text", "textarea", "number", "date", "money", "file", "file-image", "boolean", "select", "select-multiple", "any"];
export const availableFlowEntityMasks : Array<FlowEntitySchemaInfo['mask']> = ['email', 'cpf', 'cnpj', 'cpf-cnpj', 'cep', 'phone', 'url', 'whatsapp-md'];
export interface FlowEntitySubSchema{
  type: 'sub-schema',
  label: string,
  placeholder: string,
  schema: Record<string, FlowEntitySubSchema | FlowEntitySchemaInfo>,
  required?: boolean,
  observer?: boolean,
  /** Restrições de dados */
  restrictions?: {
    /**
     * - $this.<key>: para o dado que está sendo inserido no sub-schema
     * - quando não utiliza o $this, o dado se referirá a raiz do flowEntityData
     */
    condition: string,
    /**
     * Tem a capacidade de renomear a variável $this do condition (usada para se referir ao valor atual). \
     * Ex:
     * ```
     *  const newData = { name: 'Teste' }
     * 
     *  const defaultRef = '$this.name;#eq;*Teste'; // true
     *  // this_ref = 'curr' 
     *  const changedRef = '$curr.name;#eq;*Teste'; // true
     * ```
     */
    this_ref?: string,
    /** Mensagem de erro caso a restrição seja verdadeira */
    message: string
  }[]
}
export interface FlowEntitySchemaInfoRule{
  render?: string,
  min?: number,
  max?: number,
  step?: number,
  hidden?: 'visualization' | 'edition' | 'visualization-and-edition'
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
  mask?: 'email' | 'cpf' | 'cnpj' | 'cpf-cnpj' | 'cep' | 'phone' | 'url' | 'whatsapp-md' | 'image-url' | 'hidden' | 'iframe' | 'access-token' | 'percent',
  condition_mask?: {
    type: StepViewAttrMaskType,
    condition: string,
    /**
     * Utilizado para subistituir o valor do campo pelo icone pela cor indicada
     */
    icon?: AvailableIcons,
    alt?: string
  }[],
  options?: { value: string, name: string }[],
  autocomplete?: {
    /** Se iniciar com @ está se referindo alguma função hardcode, e não do WF Entities */ 
    name: string, 
    /** autocomplete.response => field to fill */
    toFill?: Record<string, string>,
    trigger?: { mode: 'keyup' } | {
      mode: 'clickToNext',
      target: string
    },
    /** Valida se o valor inserido na importação existe na base do autocomplete */
    restricted?: boolean,
    /** Adiciona uma opção no final para adicionar registro na base  informada */
    add_more_options?: boolean,
    /**
     * String condition, para filtrar os dados do autocomplete. \
     * Para acessar variáveis considere que:
     * - $\<variavel>: É uma variável dentro do valor retornado
     * - $flow_data:\<variavel>: É uma variável dentro do flow_data
     * - $observer:\<variavel>: É uma variável observável alterada em tempo de execução
     */
    filter_condition?: string,
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
  customData?: StepItemCustomListDraggable | StepItemCustomList | {
    mode: '@list-draggable',
    settings?: any
  },
  rules?: FlowEntitySchemaInfoRule,
  observer?: boolean,
  dynamic_mask?: StepItemAttrMaskDynamicType | StepItemAttrMaskStringType,
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
  insert_mode?: 'append' | 'prepend',
  /**
   * Aglutinação de linhas \
   * Utilizado para aglutinar linas de sub-schemas
   */
  line_aggregation?: {
    /**
   * Quais valores serão utilizado para identificar o registro \
   */
    identifier: string[]
  },
}
export interface FlowEntityExportDatas{
  title: string,
  omit_columns?: Array<string>
}
export interface FlowEntityViewModeGrid{
  type: 'grid',
  classNames: {
    /** Div que defini o grid */
    main?: string,
    wrapper?: string,
    image?: string,
    title?: string,
    tbody?: string,
    tr?: string,
    /**
     * Para cada item dinâmico poderá ser passado o id do item,
     * e a classe respectiva.
     */
    dynamic_contents?: Record<string, string>
  },
  resume: {
    picture?: string,
    title: string,
    subtitle?: string,
    /**
     * O content utiliza as configurações do schema para renderizar \
     * a sua coluna.
     */
    content?: string[],
    /**
     * O dynamic_content permite construir layouts personalizados para renderizar \
     * seus dados.
     */
    dynamic_content: WorkflowViewModeDashboardModuleBlock[]
  }
}
export type AvailableFlowEntityViewModes = FlowEntityViewModeGrid
export interface FlowEntityRelations {
  entity_id: string,
  append_values: Record<string, any>,
  title: string,
  query?: Record<string, string>
}
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
    select?: string,
    export?: {
      /** 
       * permission: Permissão
       * allowed_columns: Colunas que somente essa permissão tera acesso
      */
      permission: string,
      allowed_columns: string[]
    }
  },
  /** default = true */
  restrictMode?: boolean,
  created_at?: Date,
  importSheet?: FlowEntityImportSheet,
  exportDatas?: Array<FlowEntityExportDatas>,
  is_public?: boolean,
  styles_form?: FlowEntityStylesForm,
  relations?: FlowEntityRelations[]
}

export interface FlowEntityStylesFormGroup{
  mode: 'group-collapse',
  title: string,
  items: string[]
}
export interface FlowEntityStylesForm {
  groups?: FlowEntityStylesFormGroup[]
}

export interface StepItemCustomListDraggable{
  mode: '@list-draggable',
  settings: {
    /** Título que aparecerá no modal */
    title?: string,
    initial_value?: Record<string, any>[]
  }
}

export interface StepItemCustomList{
  mode: '@list',
  settings: {
    mode: 'inline',
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