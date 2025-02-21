import { WorkflowConfigFilterType } from "./workflow.config.type";

export type WorkflowConfigRulesType = WorkflowConfigRuleConvergence | WorkflowConfigRuleFormatters;
interface WorkflowConfigRulesBase{ condition?: string }
/** Regra para unir dois flow-datas */
export interface WorkflowConfigRuleConvergence extends WorkflowConfigRulesBase{
  type: 'convergence',
  data: {
    /** Com suporte a shortcode no value do ```{ key: \@[value] }``` */
    query: Record<string, string | {
      type: WorkflowConfigFilterType['type'],
      value: any
    }>,
    /** 
     * { \<chave-no-flow-data-já-existente-no-banco>: <chave-no-novo-flow-data> }
     * 
     * Se passar duas strings(string: string) fará o overwrite dos dados de origem. Caso queira um comportamento \
     * especifico, abra o objeto e selecione o tipo adequado.
     */
    replacers: Record<string, string | WorkflowConfigRuleConvergeReplacer>,
    effects?: WorkflowConfigRuleConvergeEffect[]
  }
}
export interface WorkflowConfigRuleConvergeReplacer{
  ref: string,
  /**
   * - [merge] irá mesclar os campos, caso seja objeto ou array(ambos precisam ser do mesmo tipo, ou undefined) \
   * e caso no máximo um seja undefined.
   * - [overwrite] sobrescrever os dados de origem
   * - [over-left] só sobrescreverá se os dados da esquerda não estiverem preenchidos
   * - [over-right] só sobrescreverá se os dados da direita estiverem preenchidos
   */
  type: 'merge' | 'overwrite' | 'over-left' | 'over-right'
}
export interface WorkflowConfigRuleConvergeEffect{
  /** - (default) always */
  only?: 'always' | 'converged' | 'diverged',
  append_values: Record<string, any>
}
/** Regra de formatação de dados do flow-data */
export interface WorkflowConfigRuleFormatters extends WorkflowConfigRulesBase{
  type: 'formatters',
  data: Array<{
    condition?: string
    name: string,
    /** Com suporte a code-helpers e shortcodes */
    value: string | undefined,
  }>
}