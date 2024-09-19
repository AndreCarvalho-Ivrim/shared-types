interface FlowMessageBase{
  /** Obrigatório na raiz do flowMessage */
  _id?: string,
  /** Obrigatório na raiz do flowMessage */
  client_id?: string,
  /** É para ser usada como referência de chamada por outras funções */
  key: string,
  /**
   * active: Interação ativa, é quando nós entramos en contato com o cliente
   * passive: Interação passiva, é quando o cliente entra em contato
   */
  interaction_mode: 'active' | 'passive',
  /**
   * São palavras chaves para validar a chamada dessa mensagem. Muito utilizado \
   * quando há uma lista de opções(Exemplo: 1-10) e você quer que sua mensagem \
   * seja enviada apenas se ele digitar uma opção X.
   */
  matchs?: string[],
  /** Conteúdo da mensagem, podendo ser N mensagens. */
  contents: string[],
}
export interface FlowMessageInfoType extends FlowMessageBase{
  /** info: Informação apenas envia uma mensagem sem esperar retorno */
  mode: 'info',
}
export interface FlowMessageAskType extends FlowMessageBase{
  /** ask: É uma pergunta que necessita da resposta do cliente */
  mode: 'ask',
  /** respostas possíveis do usuário */
  responses: (
    Omit<FlowMessageInfoType, 'interaction_mode' | '_id' | 'client_id'> | 
    Omit<FlowMessageAskType, 'interaction_mode' | '_id' | 'client_id'> | 
    FlowMessageRedirectType
  )[]
}
export interface FlowMessageRedirectType{
  /** É para ser usada como referência de chamada por outras funções */
  key: string,
  /** redirect: É a possibilidade de redirecionar para outra região do diálogo */
  mode: 'redirect',
  matchs?: string[],
  /** Mensagem de transição, antes de redirecionar */
  contents?: string[],
  /** Chave(ou caminho) do diálogo que quer chamar */
  redirect_to: string[]
}

export type FlowMessageType = FlowMessageInfoType | FlowMessageAskType;

export interface FlowMessageContact{
  _id: string,
  client_id: string,
  /** Usado apenas quando o contato é usuário do hub */
  user_id?: string,
  first_name?: string,
  last_name?: string,
  status?: string,
  phone: string
  interaction?: {
    flow_message_id: string,
    /** Chave de onde o contato está no fluxo */
    step: string[],
    start_of_interection: Date,
    last_update: Date
  }
}