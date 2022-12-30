/**
 * Defines a form field structure
 */
export interface IFieldDescription {
  fieldType: string;
  register: string;
  initialValue: string;
  bitmap: string;
  registerDefaultValue?: string;
  registerMaxSize?: string;
  registerMinSize?: string;
  registerSize?: string;
  registerCondition?: object;
  registerBitmap?: string;
}
