export interface ClosingFolderType{
  _id   : string
  title : string
  description? : string
  type  : 'dir' | 'file'
  items : (ClosingFolderDir | ClosingFolderFile)[]
  created_at: Date
  updated_at: Date
  client_id : string
  user_id : string

}
export interface ClosingFolderDir extends Omit<ClosingFolderType, 'client_id' | 'type'>{
  type: 'dir'
}
export interface ClosingFolderFile extends Omit<ClosingFolderType, 'client_id' | 'type' | 'items'>{
  type: 'file'
  src : string
  size? : number
}