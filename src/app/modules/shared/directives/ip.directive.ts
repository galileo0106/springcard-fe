import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ipValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const errorValue = { ipValue: { value: control.value } };
    const fieldValue = control.value;
    if (!fieldValue) {
      return null;
    }

    if (typeof fieldValue === 'string' || fieldValue instanceof String) {
      if (fieldValue.trim() === '' || fieldValue.trim() === '0') {
        return null;
      }
    }

    // prettier-ignore
    const isValid = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(fieldValue) ? null : errorValue;
    return isValid;
  };
}
