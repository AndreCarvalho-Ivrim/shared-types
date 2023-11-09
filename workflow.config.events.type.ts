import { CreateScheduleEvent } from "./schedule.type"

export interface WFCalendarEvent extends Omit<CreateScheduleEvent, 'start' | 'end' | 'email' | 'guests' | 'tags'>{
  /** Caminho da data no flowData.data */
  start: string,
  /** Caminho da data no flowData.data */
  end?: string,
  /** Com suporte a shortcodes \@[] */
  tags?: string[],
  guests: {
    /**
     * Usuários a serem incluídos, podendo usar as mesmas regras de \
     * workflow.config.notification
     * - [@data_creator]                Criador do flow data
     * - [@data_owners]                 Responsáveis pelo flow data
     * - [@wf_owner]                    Responsável pelo workflow
     * - [@to:<contact1>[,<contact2>]]  Contato(s) pré-definido(s)
     * - 'path-to-contact'              Caminho para o registro dentro do flow_data.data 
     *                                  que contenha o contato
     */
    owner: string[],
    /**
     * Usuários a serem incluídos, podendo usar as mesmas regras de \
     * workflow.config.notification
     * - [@data_creator]                Criador do flow data
     * - [@data_owners]                 Responsáveis pelo flow data
     * - [@wf_owner]                    Responsável pelo workflow
     * - [@to:<contact1>[,<contact2>]]  Contato(s) pré-definido(s)
     * - 'path-to-contact'              Caminho para o registro dentro do flow_data.data 
     *                                  que contenha o contato
     */
    guest: string[]
  }
}