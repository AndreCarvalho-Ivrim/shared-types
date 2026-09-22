/**
 * Contrato de dados da exception view `isac-crm-overview`.
 *
 * O back-end (fn-exception `isac-crm-overview`) devolve valores crus (números),
 * a formatação é responsabilidade do front (`utils/format.ts`).
 *
 * Fatia atual: KPIs + Fluxo comercial.
 * Próximas fatias: radar, temperatura, tarefas, calendário, barras e alertas.
 */

export type CrmOverviewValueFormat =
  | 'currency'
  | 'currency-compact'
  | 'percent'
  | 'percent-points'
  | 'integer'
  | 'number';

export type CrmOverviewTrendDirection = 'up' | 'down' | 'flat';

export interface CrmOverviewTrend {
  direction: CrmOverviewTrendDirection;
  value: number;
  format: CrmOverviewValueFormat;
  /** Ex.: "vs. mês anterior" */
  label?: string;
}

export interface CrmOverviewKpi {
  key: string;
  label: string;
  value: number;
  format: CrmOverviewValueFormat;
  /** Texto auxiliar exibido abaixo do valor quando não há `trend`. */
  hint?: string;
  trend?: CrmOverviewTrend;
}

//#region Fluxo comercial

/**
 * `open`    -> etapa com sub-status detalhados (Leads, Negociação)
 * `standby` -> processos em espera
 * `lost`    -> processos encerrados sem venda
 * `won`     -> processos convertidos
 */
export type CrmFunnelStageKind = 'open' | 'standby' | 'lost' | 'won';

export interface CrmFunnelSubStage {
  key: string;
  label: string;
  count: number;
  amount: number;
}

export interface CrmFunnelStage {
  key: string;
  label: string;
  kind: CrmFunnelStageKind;
  count: number;
  amount: number;
  /** Presente apenas em etapas `open`. */
  subStages?: CrmFunnelSubStage[];
}

export interface CrmOverviewFlow {
  /** Código ISO da moeda dos valores (`amount`). Ex.: "BRL". */
  currency: string;
  totalProcesses: number;
  totalAmount: number;
  stages: CrmFunnelStage[];
}

//#endregion Fluxo comercial

//#region Radar comercial

/** Ordem fixa: value (topo) → margin (dir.) → vertical (base) → segment (esq.). */
export type CrmRadarAxisKey = 'value' | 'margin' | 'vertical' | 'segment';

export interface CrmRadarAxis {
  key: CrmRadarAxisKey;
  /** Rótulo exibido no vértice do eixo. Ex.: "VALOR". */
  label: string;
  /** Score normalizado 0–100 (real). Normalização é do back-end. */
  score: number;
  /** Leitura textual do eixo. Ex.: "R$ 4,82 mi", "28,6%", "Saúde · 41%". */
  readout: string;
  /**
   * Score da meta (0–100, mesma escala do `score`) — segunda agulha do
   * radar. Ausente quando a meta desse eixo não está configurada; nesse
   * caso o front não desenha a linha da meta em nenhum eixo (tudo ou nada).
   */
  targetScore?: number;
}

export interface CrmOverviewGoal {
  /** Se não configurada, o front borra o card e mostra "Configurar meta". */
  configured: boolean;
  /** Meta em R$ pro eixo Valor. Ausente quando `configured: false`. */
  targetValue?: number;
  /** Início do período da meta (ISO date) — define o recorte que os 4 eixos olham. Granularidade de mês (o dia é ignorado). */
  periodStart?: string;
  /** Fim do período da meta (ISO date), inclusive o mês. Pode cruzar anos (ex.: jan/26 a jan/27). */
  periodEnd?: string;
  /** Meta de margem média (%). */
  marginTarget?: number;
  /** Vertical acompanhada pelo eixo Vertical (não é mais "a dominante"). */
  targetVertical?: string;
  /** Meta de quantidade (número bruto de negócios, não %) da `targetVertical` no funil. */
  verticalTarget?: number;
  /** Segmento acompanhado pelo eixo Segmento (não é mais "o dominante"). */
  targetSegment?: string;
  /** Meta de quantidade (número bruto de negócios, não %) do `targetSegment` no funil. */
  segmentTarget?: number;
}

export interface CrmOverviewRadar {
  /** Exatamente 4 eixos, na ordem de `CrmRadarAxisKey`. Uma leitura só — sem série de comparação (a bússola original também não tinha). */
  axes: CrmRadarAxis[];
  /** Estado da meta comercial (eixo Valor) — vem de um flow-entity `single`, não do mock. */
  goal: CrmOverviewGoal;
}

//#endregion Radar comercial

//#region Temperatura dos leads

export type CrmLeadTemperatureKey = 'hot' | 'warm' | 'cold';

export interface CrmLeadTemperatureBucket {
  key: CrmLeadTemperatureKey;
  label: string;
  count: number;
  /** Participação no total, 0–100. */
  percent: number;
}

export interface CrmOverviewTemperature {
  total: number;
  /** Ordem: hot → warm → cold. */
  buckets: CrmLeadTemperatureBucket[];
}

//#endregion Temperatura dos leads

//#region Tarefas do comercial

/** Urgência do prazo — define a cor do texto do vencimento. */
export type CrmTaskDueTone = 'today' | 'soon' | 'ok';

export interface CrmTaskResponsible {
  name: string;
  /** Iniciais pro avatar quando não há foto. Ex.: "RM". */
  initials: string;
  picture?: string;
}

/**
 * Tarefa do CRM (mesma base do "Minhas Tarefas"), no recorte da visão gerencial:
 * etapa · nome do lead · vencimento · responsável.
 */
export interface CrmOverviewTask {
  key: string;
  /** Etapa do funil em que o lead está. Ex.: "Negociação". */
  stage: string;
  /** Categoria da etapa — define a cor do marcador. */
  stageKind: CrmFunnelStageKind;
  /** Nome do lead / proposta. */
  leadName: string;
  /** Descrição da tarefa (linha secundária / tooltip). */
  taskLabel?: string;
  /** Vencimento já formatado. Ex.: "Hoje, 16h", "12/09". */
  due: string;
  dueTone: CrmTaskDueTone;
  responsible: CrmTaskResponsible;
  /** ID do registro, pra abrir a proposta. */
  flowDataId?: string;
}

export interface CrmOverviewTasks {
  total: number;
  /** Quantas mostrar antes do "ver todas". */
  previewCount: number;
  items: CrmOverviewTask[];
}

//#endregion Tarefas do comercial

/**
 * Não há bloco de calendário no contrato: a agenda do Overview é o
 * `EmbedCalendar` do isac, que tem sua própria fonte de dados (`ScheduleContext`).
 */

//#region Barras (por vertical / tempo por etapa)

export interface CrmBarItem {
  key: string;
  label: string;
  value: number;
}

export interface CrmBarSeries {
  key: string;
  title: string;
  /** Rótulo da unidade no chip. Ex.: "quantidade", "em dias". */
  unit: string;
  format: CrmOverviewValueFormat;
  items: CrmBarItem[];
  /** Item cuja barra recebe cor de alerta (ex.: etapa mais lenta). */
  highlightKey?: string;
}

//#endregion Barras

//#region Alertas (ticker)

export type CrmAlertTone = 'info' | 'attention' | 'positive' | 'legal';

export interface CrmOverviewAlert {
  key: string;
  text: string;
  tone: CrmAlertTone;
}

//#endregion Alertas

//#region Filtros

export interface CrmOverviewFilterOption {
  value: string;
  label: string;
}

/** Vertical do lead e equipe (vendedor responsável pelo processo) — ambos multivalorados. */
export interface CrmOverviewFilters {
  vertical: CrmOverviewFilterOption[];
  team: CrmOverviewFilterOption[];
}

export interface CrmOverviewFilterValue {
  vertical?: string[];
  team?: string[];
}

//#endregion Filtros

//#region Configuração (exception_view.data)

/**
 * Config da tela, declarada em `exception_views[].data` no template do fluxo e
 * enviada no corpo da request pro back montar as agregações.
 */
export interface CrmOverviewConfigStage {
  key: string;
  label: string;
  kind: CrmFunnelStageKind;
  /** Slugs (`step.id`) das etapas do fluxo que compõem essa coluna. */
  stepIds: string[];
  /**
   * Sub-status exibidos (apenas `kind: 'open'`). Ausente → o back deriva dos
   * status distintos encontrados.
   */
  subStages?: {
    status: string;
    label: string;
    /** Marca esse sub-status como "aguardando validação jurídica" pro alerta do ticker. */
    legalReview?: boolean;
  }[];
}

export interface CrmOverviewConfig {
  /** Código ISO da moeda. Default "BRL". */
  currency?: string;
  /** Nomes dos campos do flow-data; cada um tem default no back. */
  fields?: {
    value?: string;
    probability?: string;
    status?: string;
    temperature?: string;
    vertical?: string;
    segment?: string;
    /** Nome do lead/proposta, usado na tabela de tarefas. Default "proposal_name". */
    leadName?: string;
    /** Data de previsão de fechamento. Default "closing_forecast". */
    closingForecast?: string;
    /** Vendedor responsável pelo processo (filtro "Equipe"). Default "responsible". */
    responsible?: string;
    /** Margem %, dentro de `summary_calculations`. Default "summary_calculations.margin_percent". */
    margin?: string;
    /** Início do contrato, base do cálculo proporcional do eixo Valor. Default "summary_calculations.start_date". */
    contractStartDate?: string;
    /** Valor de fatura mensal, base do cálculo proporcional do eixo Valor. Default "summary_calculations.total_invoice". */
    monthlyInvoice?: string;
    /** Origem do lead, usada no card "Origem do lead". Default "client.origin_name". */
    leadOrigin?: string;
    /** Grupo econômico do cliente, usado no card "Grupo econômico". Default "client.economic_group_name". */
    economicGroup?: string;
  };
  /** Chave do flow-entity `single` que guarda a meta comercial (eixo Valor). Default "commercial_goal". */
  goalEntityKey?: string;
  stages: CrmOverviewConfigStage[];
  /** Peso 0–1 por `stage.key` pro forecast ponderado (fallback do campo probability). */
  forecastWeights?: Record<string, number>;
  /** Quantas tarefas mostrar antes do "ver todas". Default 10. */
  tasksPreviewCount?: number;
  /** Limiares dos alertas do ticker. Defaults: parado 7 dias, fechamento próximo 3 dias. */
  alertThresholds?: {
    stalledDays?: number;
    closingSoonDays?: number;
  };
}

//#endregion Configuração

export interface CrmOverviewData {
  kpis: CrmOverviewKpi[];
  flow: CrmOverviewFlow;
  radar?: CrmOverviewRadar;
  temperature?: CrmOverviewTemperature;
  tasks?: CrmOverviewTasks;
  bars?: CrmBarSeries[];
  alerts?: CrmOverviewAlert[];
  filters?: CrmOverviewFilters;
}

export interface CrmOverviewRequestBody {
  flow_id: string;
  config: CrmOverviewConfig;
  filter?: CrmOverviewFilterValue;
}
