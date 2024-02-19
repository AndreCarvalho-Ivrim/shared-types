export interface FlowDataNote{
  _id?: string,
  attachments?: Array<{
    url: string,
    id: string,
    name: string
  }>,
  content: string,
  author: string,
  answers?: FlowDataNote[],
  created_at?: Date,
  updated_at?: Date,
  /** Id dos usuários que curtiram */
  likes?: string[],
  /** Id dos usuários que deram deslike */
  unlikes?: string[]
}
export interface FlowDataNotesType{
  _id: string,
  flow_id: string,
  flow_data_id: string,
  notes: FlowDataNote[]
}