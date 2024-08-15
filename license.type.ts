export type LicenseServiceType = 'widget' | 'application' | 'module';
export const translateLicenseService : Record<LicenseServiceType, string> = {
  widget: 'Widget',
  application: 'Aplicativo',
  module: 'Módulo'
}
export interface AvailableLicenseServiceType{
  id:             string,             
  type:           LicenseServiceType,
  name:           string,
  title:          string,
  description:    string,
  picture?:       string,
  
  /** Preço por usuário */
  price_per_user?: number,
  /** Preço por convidado */
  price_per_guest?: number,
  /** Preço por volumetria */
  price_per_volumetry?: number,
  /** Unidade de volumetria. Válido apenas quando [price_per_volumetry] for preenchido */
  volumetric_unit?: number,
  /** Limitador de quantidade */
  limiter?: number,
  /** Preço por transbordamento de [limiter]. Válido apenas quando a propriedade [limiter] for preenchida. */
  price_per_overflow?: number,
  /** Unidade de transbordamento. Válido apenas quando a propriedade [price_per_overflow] for preenchida. */
  overflow_unit?: number,
  
  data?: any,
  created_at: Date,
  updated_at: Date,
  active: boolean,
}