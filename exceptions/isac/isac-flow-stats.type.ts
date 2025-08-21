export interface AnalysisGroupColumn{
  /**
   * Key do flow-data ou utilitários:
   * 
   * - \@steps: Gera uma coluna por etapa
   * - \@progress: Se a análise gera um progresso acessa o valor
   */
  key: string,
  /**
   * No caso da key = \@steps é necessário utilizar o valor \@step-title ou \@step-name
   */
  name: string
  formating?: 'percent'
}
interface AnalysisGroupBase{
  key: string,
  title: string,
  columns: AnalysisGroupColumn[]
}

interface AnalysisGroupQuantityPerStep extends AnalysisGroupBase{
  mode: 'quantity-per-step',
  groupBy?: string[],
  completed_steps: string[]
}

export type AnalysisGroupType = AnalysisGroupQuantityPerStep;