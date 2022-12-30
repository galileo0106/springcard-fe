export interface IFieldAndRegisterDefinition {
  fieldName?: string;
  fieldType: string;
  register: string;
  initialValue: string | number;
  bitmap: string;
  isIndividual: boolean;
  registerDefaultValue?: string;
  registerMaxSize?: number;
  registerMinSize?: number;
  registerSize?: number;
  registerCondition?: string;
  registerBitmap?: string;
}
