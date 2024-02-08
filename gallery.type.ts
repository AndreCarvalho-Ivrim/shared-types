export type GalleryAvailableType = 'workflow' | 'template' | 'personal';
export const galleryAvailableTypes : GalleryAvailableType[]= ['workflow', 'template', 'personal'];
export const galleryAvailableTypesFormatted : Record<GalleryAvailableType, string> = {
  workflow: 'Workflow',
  template: 'Modelos de Mensagem',
  personal: 'Pessoal'
} 
export interface GalleryItemRefs{
  url: string,
  type: GalleryAvailableType,
  external_id: string
}
export interface GalleryType{
  id: string
  name : string,
  user_id: string,
  client_id: string,
  external_id? : string,
  type : GalleryAvailableType,
  num_items?: number,
  total_size?: number,
  items?: GalleryItemType[]
}
export interface GalleryItemType{
  progress: number;
  id: string,
  gallery_id: string,
  name : string,
  description?: string,
  src  : string,
  size : number,
  refs? : GalleryItemRefs[],
  type : GalleryAvailableType,
  created_at: string,
  updated_at: string,
  gallery_name?: string,
  selected: boolean;
}