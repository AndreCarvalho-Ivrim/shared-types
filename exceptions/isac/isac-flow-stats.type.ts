import { WorkflowConfigFilterType } from "../../workflow.config.type";

export interface AnalysisGroupColumn{
  /**
   * Key do flow-data ou utilitários:
   * 
   * - \@steps: Gera uma coluna por etapa
   * - \@progress.total | \@progress.total_completed | \@progress.percent: Gera o calculo de completos baseado no completed_steps
   */
  key: string,
  /**
   * No caso da key = \@steps é necessário utilizar o valor \@step-title ou \@step-name
   */
  name: string
  formating?: 'percent'
}
interface AnalysisGroupBase {
  key: string,
  title: string,
  columns: AnalysisGroupColumn[],
  filter?: WorkflowConfigFilterType[]
}

export interface AnalysisGroupQuantityPerStep extends AnalysisGroupBase {
  mode: 'quantity-per-step',
  groupBy?: string[],
  completed_steps: string[]
}

export interface AnalysisGroupCountByGroup extends AnalysisGroupBase {
  mode: 'count-by-group',
  groupBy: string[],
  unwind?: string,
  extraFields?: string[]
}

export type AnalysisGroupType = AnalysisGroupQuantityPerStep | AnalysisGroupCountByGroup;