/**
 * `done`    -> bateu o mínimo
 * `partial` -> tem algo, mas abaixo do mínimo
 * `missing` -> nada cadastrado
 */
export type CrmSetupItemState = 'done' | 'partial' | 'missing';

/**
 * Como o back mede o item:
 * `entity`        -> conta registros de uma entidade dinâmica
 * `single-entity` -> entidade `single` (0 ou 1), ex.: Meta Comercial
 * `param`         -> parâmetros obrigatórios do fluxo preenchidos
 * `permission`    -> perfis de permissão que incluem uma ação
 */
export type CrmSetupItemKind = 'entity' | 'single-entity' | 'param' | 'permission';

//#region Configuração (exception_view.data)

export interface CrmSetupConfigItem {
  key: string;
  label: string;
  kind: CrmSetupItemKind;
  /** `entity_key` (`entity`/`single-entity`) ou slug da ação (`permission`). Vazio em `param` — quem manda é `requiredParams`. */
  target: string;
  /**
   * Só em `kind: 'param'`. Vem na config, e não do `utils_schema`, porque o
   * fluxo salvo guarda apenas os valores dos parâmetros, não a declaração.
   */
  requiredParams?: { key: string; label: string }[];
  /** Texto do "Por que importa" exibido ao expandir a linha. */
  why: string;
  /** Quantos registros bastam pro item ficar `done`. Default 1. */
  minCount?: number;
  /** Próximo passo, exibido só quando o item está pendente. */
  hint?: string;
  /** Rótulo do botão de ação. Default "Abrir". */
  actionLabel?: string;
  /** Unidade exibida abaixo da contagem. Default "cadastrados". */
  unitLabel?: string;
}

export interface CrmSetupConfigGroup {
  key: string;
  title: string;
  hint?: string;
  /** Chave em `template_params` com o id do fluxo dos itens. Ausente = fluxo do próprio CRM. */
  sourceParam?: string;
  /**
   * `key` de itens de OUTROS grupos que precisam estar `done` antes deste
   * grupo liberar (ex.: Meta Comercial depende de Verticais e Segmentos).
   * Pendente → grupo bloqueado, mesmo cadeado de um `sourceParam` vazio.
   */
  dependsOnItemKeys?: string[];
  items: CrmSetupConfigItem[];
}

/** Card do Overview e os itens de que ele depende pra funcionar. */
export interface CrmSetupConfigWidget {
  key: string;
  label: string;
  /** `key` dos itens (`CrmSetupConfigItem.key`) necessários. */
  dependsOn: string[];
  /**
   * Subconjunto de `dependsOn` que bloqueia o card inteiro (ex.: a Bússola
   * borra tudo sem a Meta Comercial) — força `missing` mesmo com os outros
   * prontos. Ausente = nenhuma dependência é bloqueante.
   */
  blockedBy?: string[];
}

export interface CrmSetupConfig {
  groups: CrmSetupConfigGroup[];
  widgets?: CrmSetupConfigWidget[];
}

//#endregion Configuração

//#region Resposta

export interface CrmSetupItem {
  key: string;
  label: string;
  kind: CrmSetupItemKind;
  state: CrmSetupItemState;
  /** Quantos registros existem hoje. */
  count: number;
  /** Quantos bastam pra ficar `done` (vem do `minCount`). */
  required: number;
  /** Total possível pro "x de y" — hoje só em `param`. */
  total?: number;
  unitLabel: string;
  why: string;
  hint?: string;
  actionLabel: string;
  /** Rótulos dos cards do Overview que esse item alimenta. */
  feeds: string[];
  /** Sub-itens pendentes nomeados — hoje só em `param`. Ausente nos demais tipos e quando `done`. */
  missingChecklist?: string[];
  /** `entity_key` pra abrir a tela da entidade. Ausente em `param` e `permission`. */
  entityKey?: string;
  /** Fluxo onde a entidade mora (nem sempre o do CRM — Verticais ficam na Matriz). Ausente junto com `entityKey`. */
  entityFlowId?: string;
}

export interface CrmSetupGroup {
  key: string;
  title: string;
  hint?: string;
  items: CrmSetupItem[];
  /** Itens `done` sobre o total — o "x de y prontos" do cabeçalho. */
  doneCount: number;
  totalCount: number;
  /** 0–100, com item `partial` valendo meio ponto. */
  percent: number;
  /** Motivo do grupo não poder ser lido (`sourceParam` vazio ou dependência pendente) — itens vêm com `count: 0`. */
  unavailableReason?: string;
}

export interface CrmSetupWidget {
  key: string;
  label: string;
  state: CrmSetupItemState;
  /** Rótulos dos itens que ainda faltam pra esse card funcionar. */
  missingLabels: string[];
  /** `key` do primeiro item pendente — destino do clique no card. */
  firstPendingKey?: string;
}

export interface CrmSetupSummary {
  /** 0–100, com item `partial` valendo meio ponto. */
  percent: number;
  doneCount: number;
  partialCount: number;
  missingCount: number;
  totalCount: number;
  /** Próximo item a resolver, na ordem em que os grupos foram declarados. */
  nextPendingKey?: string;
  nextPendingLabel?: string;
}

export interface CrmSetupData {
  summary: CrmSetupSummary;
  groups: CrmSetupGroup[];
  widgets: CrmSetupWidget[];
}

//#endregion Resposta

export interface CrmSetupRequestBody {
  flow_id: string;
  config: CrmSetupConfig;
}
