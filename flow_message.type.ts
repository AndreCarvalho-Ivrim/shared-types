interface FlowMessageBase{
  _id: string,
  client_id: string,
  flow_id?: string,
  /** Id do template do whatsapp, caso seja uma mensagem cadastrada */
  template_id?: string,
  /** É para ser usada como referência de chamada por outras funções */
  key: string,
  /**
   * active: Interação ativa, é quando nós entramos en contato com o cliente
   * passive: Interação passiva, é quando o cliente entra em contato
   */
  interaction_mode: 'active' | 'passive',
  message_of_invalid_answer?: string,
  /**
   * São palavras chaves para validar a chamada dessa mensagem. Muito utilizado \
   * quando há uma lista de opções(Exemplo: 1-10) e você quer que sua mensagem \
   * seja enviada apenas se ele digitar uma opção X.
   */
  matchs?: string[],
  /** Conteúdo da mensagem, podendo ser N mensagens. */
  contents: string[],
  /** A função é considerada ao entrar no diálogo atual */
  fns?: FlowMessageFn[]
}
export interface FlowMessageInfoType extends FlowMessageBase{
  /** info: Informação apenas envia uma mensagem sem esperar retorno */
  mode: 'info',
  redirect_to?: string[]
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
export type FlowMessageResponse = (
  Omit<FlowMessageInfoType, 'interaction_mode' | '_id' | 'client_id'> | 
  Omit<FlowMessageAskType, 'interaction_mode' | '_id' | 'client_id'> | 
  FlowMessageRedirectType
)
export interface FlowMessageAskType extends FlowMessageBase{
  /** ask: É uma pergunta que necessita da resposta do cliente */
  mode: 'ask',
  /** respostas possíveis do usuário */
  responses: FlowMessageResponse[]
}
export type FlowMessageType = FlowMessageInfoType | FlowMessageAskType;

export interface FlowMessageFnCallTrigger{
  mode: 'call-trigger',
  /** strc com acesso a veriável $message, caso seja executado após receber uma mensagem */
  condition?: string,
  /** Executado antes ou após enviar a mensagem do diálogo atual */
  execute: 'before' | 'after',
  data: {
    trigger_id: string,
    /**
     * Parametros que serão enviados para a função.\
     * Record<nome-passado-na-fn, valor-estatico | \@[shortcode] | \@code_helper>
     * 
     * Váriaveis disponíveis:
     * - message: conteúdo da mensagem
     * - curr: objeto contendo os parametros recebidos no flowMessage
     */
    params?: Record<string, any>,
    /** Se a função será executada em segundo plano */
    is_async?: boolean,
    /** Só é válido se [is_async] não for true */
    effects?: Array<{
      condition?: string,
      redirect_to?: string[],
      only?: 'always' | 'success' | 'fail';
      /** Retornar resposta dinâmica ao cliente com suporte a strc */
      response?: string,
      /** Para a verificação de efeitos */
      breakExec?: boolean,
      /** Válido apenas para execute = before */
      stop_sending?: boolean
    }>
  }
}
export interface FlowMessageFnSendMessage{
  mode: 'send-message',
  /** strc com acesso a veriável $message, caso seja executado após receber uma mensagem */
  condition?: string,
  only?: 'always' | 'success' | 'fail';
}
export type FlowMessageFn = FlowMessageFnCallTrigger | FlowMessageFnSendMessage


export interface IReceiveFlowMessageWebhook {
  idMessage: number,
  createdAt: string,
  updatedAt: string,
  idContact: number,
  status: string,
  received: boolean,
  errorCode: number,
  audio: [
    {
      url: string
    }
  ],
  campaigns: [
    {
      idCampaign: number
    }
  ],
  document: [
    {
      url: string
    }
  ],
  image: [
    {
      url: string
    }
  ],
  sharedContact: [
    {
      name: string,
      phone: string
    }
  ],
  template: [
    {
      idTemplate: number
    }
  ],
  text: [
    {
      text: string
    }
  ],
  video: [
    {
      url: string
    }
  ]
}
export interface FlowMessageContact{
  _id: string,
  client_id: string,
  /** Usado apenas quando o contato é usuário do hub */
  user_id?: string,
  first_name?: string,
  last_name?: string,
  status?: string,
  phone: string
  contact_data?: any,
  interaction?: {
    flow_message_id: string,
    /** Chave de onde o contato está no fluxo */
    step: string[],
    start_of_interection: Date,
    last_update: Date,
    interaction_data?: any
  }
}
export interface FlowMessageContactPendingMessage{
  flow_message_id: string;
  step: string[];
  interaction_data?: any;
}