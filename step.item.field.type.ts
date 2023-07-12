import { ItemOrViewOrWidgetOrIntegration } from ".";

export type StepItemAttrTypeType = 'text' | 'textarea' | 'select' | 'select-multiple' | 'radio' | 'checkbox' | 'date' | 'file' |  'file-multiple' |  'group-collapse' | 'custom';
export const stepItemAttrTypeFormatted : Record<StepItemAttrTypeType,string> = {
  text: 'Entrada de Texto',
  textarea: 'Entrada de Texto Grande',
  select: 'Entrada de Seleção',
  'select-multiple': 'Entrada de Seleção Multipla',
  radio: 'Caixa de Seleção',
  checkbox: 'Caixa de Multipla Escolha',
  date: 'Date',
  file: 'Upload de Arquivo',
  'file-multiple': 'Upload de Multiplos Arquivos',
  'group-collapse': 'Grupo de Campos Intercalável',
  custom: 'Customizado'
};

export type StepItemAttrMaskType = 'email' | 'number' | 'money' | 'cpf' | 'cnpj' | 'cpf-cnpj' | 'cep' | 'phone';
export type ThemeColorType = 'primary' | 'success' | 'light' | 'danger' | 'warning' | 'info';
export type TargetModeType = 'single' | 'multiple' | 'trigger' | 'final';
export type StepItemModeType = 'field' | 'view' | 'widget' | 'integration';

export interface ValueAndNameStringType{
  value: string,
  name: string
}
export interface StepItemType{
  key: string,
  type: StepItemAttrTypeType,
  mode: 'field',
  mask?: StepItemAttrMaskType,
  label?: string,
  placeholder?: string,
  options?: ValueAndNameStringType[],
  required?: boolean,
  rules?: {
    min?: number,
    max?: number,
    render?: string
  },
  observer?: boolean,
  items?: ItemOrViewOrWidgetOrIntegration[],
  autocomplete?: {
    name: string, // Se iniciar com @ está se referindo alguma função hardcode, e não do WF Entities
    toFill?: Record<string, string>, // autocomplete.response => field to fill
    trigger?: { mode: 'keyup' } | {  // 
      mode: 'clickToNext',
      target: string
    }
  },
  customData?: {
    mode: AvailableCustomItemModeType,
    settings?: any
  }
}
export type AvailableCustomItemModeType = '@select-multiple-and-prorating';
export const availableCustomItemMode : AvailableCustomItemModeType[] = ['@select-multiple-and-prorating'];