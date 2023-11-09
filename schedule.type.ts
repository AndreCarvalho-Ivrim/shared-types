export interface CreateScheduleEvent {
  /** Se true, esse evento não será considerado nas regras de conflito */
  ignore_conflits?: boolean,
  email: string,
  title: string,
  /** Se o evento irá durar o dia inteiro */
  allDay: boolean,
  start: Date,
  end: Date,
  description?: string;
  /** Com suporte a regexUrl */
  redirect_to?: string;
  location?: string;
  color: 'default' | 'green' | 'red' | 'azure' | 'warning',
  /** Strings para serem utilizadas na pesquisa */
  tags?: string[]
  /** Para definir uma categoria de evento */
  type?: string,
  guests: {
    email: string;
    whatsapp?: string;
    role: 'owner' | 'guest';
    /** Id do hubUser ou flowAuth */
    user_id?: string;
    /** Se é um usuário do flowAuth */
    is_flow_auth?: boolean;
    /** Se o evento foi aceito pelo participante */
    is_accepted: boolean;
  }[],
  reminder?: {
    /** Não está sendo usado, pois a plataforma é selecionada com base nas preferências do usuário */
    type: ('email' | 'whatsapp' | 'notification')[],
    /** Quantida aplicada a unidade de medida */
    quantity: number,
    unit: 'minutes' | 'hour' | 'day' | 'week'
  },
  /**
   * Modificadores de acesso. Serão usados para filtragem na renderização do calendário. \
   * Por padrão é utilizado o [private]
   * 
   * - [protected] Todos da empresa dona da agenda podem ver o evento mesmo \
   * não sendo guest/owner 
   * - [private] Apenas os guests/owners podem ver o evento
   * - [public] Todos podem ver o evento, mesmo não autenticados
   */
  access_modifier?:  'protected' | 'private' | 'public',
  client_id: string,
  user_id: string,
  flow_id?: string,
  external_id?: string,
}