import { AbstractControl, ValidatorFn } from '@angular/forms';

export function hexadecimalValidator(minvalue: number | null, maxvalue: number | null): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const regex = RegExp('[0-9A-Fa-f]+');
    const errorValue = { hexadecimalValue: { value: control.value } };
    const fieldValue = control.value;
    if (!fieldValue) {
      return null;
    }

    if (typeof fieldValue === 'string' || fieldValue instanceof String) {
      if (fieldValue.trim() === '') {
        return null;
      }
    }
    if (fieldValue.length === 0) {
      return null;
    }

    if (!regex.test(fieldValue)) {
      console.info('Value of the hex string does not match the hex regexp');
      return errorValue;
    }

    if (fieldValue.length % 2 !== 0) {
      return errorValue;
    }

    // min et max
    const decimalFieldValue = parseInt(control.value, 16);
    if (minvalue !== null) {
      console.info('Value of the hex string is < to minvalue');
      if (decimalFieldValue < minvalue) {
        return errorValue;
      }
    }

    if (maxvalue !== null) {
      if (decimalFieldValue > maxvalue) {
        console.info('Value of the hex string is > to maxvalue');
        return errorValue;
      }
    }
    return null;
  };
}
