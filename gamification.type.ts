interface CampaignType{
  _id: string,
  name: string,
  description?: string,
  start: Date,
  end: Date,
  banner_id?: string,
}
interface LevelType{
  _id: string,
  index: number,
  name: string,
  /** EXP necessária para promoção */
  upgrade_exp?: number,
  /** EXP de corte para rebaixamento */
  downgrade_exp?: number,
  /** Promoção por posição */
  upgrade_by_position?: number,
  /** Rebaixamento por posição */
  downgrade_by_position?: number,
  bonus_exp?: number,
  /**
   * Se for false(default) limita em avançar um nível de cada vez.
   * 
   * Caso contrário e o upgrade seja por exp, ele vai testar \
   * o limite de cada nível até não poder avançar mais.
   */
  unlimit_upgrade?: boolean
}
interface PlayerType{
  _id: string,
  user: {
    name: string,
    avatar?: string,
    external_id: string,
    cpfcnpj: string,
    email: string,
    whatsapp?: string,
  },
  info: {
    exp: number,
    total_exp: number,
    coins: number,
    offensive: number,
    last_access?: Date,
    position?: number,
    level: string,
    campaign_id: string,
  },
  missions?: {
    _id: string,
    exp: number,
    title: string,
    thumbnail?: string,
    description: string,
    mission_type: AvailableMissionType,
    /** [concluded,total] */
    concludedOfTotal: [number, number],
    percent: number,
  }[]
}
/**
 * \@offensive Contabiliza a quantidade de dias seguidos ativo no app \
 * \@recomendation Contabiliza a quantidade de indicações bem sucedidas \
 * \@num-sales Contabiliza a quantidade de vendas realizadas \
 * \@total-sales Contabiliza o valor de vendas realizadas \
 * \@num-cancel-sales Contabiliza o número de cancelamentos de vendas \
 * \@customization Verifica o preenchimento de informações cadastrais do usuário \
 * \@schedule-fulfilled Contabiliza a quantidade de agendamentos realizados e bem sucedidos
 */
type AvailableMissionType = '@offensive' | '@recommendation' | '@num-sales' | '@value-sales' | '@num-cancel-sales' | '@customization' | '@schedule-fulfilled'
interface MissionBaseType{
  _id: string,
  title: string,
  description: string,
  thumbnail?: string,
  /** Quantidade de pontos que a missão vale */
  exp: number,
  /** A partir de qual level a missão é valida */
  start_trail_index?: number,
  /** Pode ser valor, número de dias, número de ocorrências, ou binário para tarefa realizada ou não */
  quantity: number,
  range_of_days?: number
}
interface MissionOffensiveType extends MissionBaseType{ mission_type: '@offensive' }
interface MissionRecommendationType extends MissionBaseType { mission_type: '@recomendation' }
interface MissionNumSalesType extends MissionBaseType { mission_type: '@num-sales' }
interface MissionValueSalesType extends MissionBaseType { mission_type: '@value-sales' }
interface MissionNumCancelSalesType extends MissionBaseType { mission_type: '@num-cancel-sales' }
interface MissionCustomizationType extends MissionBaseType{
  mission_type: '@customization',
  data: {
    /** True se a validação for realizada em um workflow externo */
    is_external: boolean,
    /** Referência dos campos que seram validados */
    fields: string[]
  }
}
interface MissionScheduleFulFilledType extends MissionBaseType{ mission_type: '@schedule-fulfilled' }
type MissionType = MissionOffensiveType | MissionRecommendationType | MissionNumSalesType | MissionValueSalesType | MissionNumCancelSalesType | MissionCustomizationType | MissionScheduleFulFilledType;
interface ActionLogType{
  _id: string,
  quantity: number,
  created_at: Date,
  mission_type: AvailableMissionType,
  data?: any,
  /** ID de referência para realizar a auditoria */
  audit_scope_id?: string,
}
interface MissionHistoryType{
  mission_id: string,
  title: string,
  thumbnail?: string,
  description: string,
  mission_type: AvailableMissionType,
  concluded_at: Date
}
interface RankingType{
  _id: string,
  name: string,
  avatar?: string,
  exp: number,
}
interface AchievementType{
  _id: string,
  title: string,
  thumbnail?: string,
  description: string,
  achievement_type: AvailableMissionType | '@level' | '@trail' | '@podium',
  concluded_at: Date,
  started_at?: Date
}
interface OffensiveType{
  started_at: Date,
  ended_at: Date,
  count: number
}
interface RuleType{
  exp: Partial<Record<(AvailableMissionType | '@level' | '@trail' | '@podium'), number>>
  offensives: '@login' | '@3min'
}
interface FeedbackType{
  exp: number,
  offensive?: number,
  missions?: {
    type: 'update' | 'new' | 'finished',
    old_percent: number,
    new_percent: number,
    exp?: number,
    id: string,
  }[],
  position?: { old?: number, new: number }
}