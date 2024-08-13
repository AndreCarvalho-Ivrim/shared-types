export interface LicenseType{
    id:             string,             
    type:           LicenseServiceType,
    name:           string,
    title:          string,
    description:    string,
    picture?:       string,
    user_acumulate: Boolean,           
    data?:          string,            
    created_at:     string, // DateTime,           
    updated_at:     string, // DateTime,            
    licenseService: string,// LicenseService[],
    active: boolean,
  }

  export interface LicenseServiceType {
    licenseType: 'Widget' | 'Aplicativo' | 'Módulo';
  }