import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Orange_nfc_officeFormGroup = {
    lookups: new UntypedFormControl({ value: "C1", disabled: false}, [Validators.required]),
    id8620_Lkl: new UntypedFormControl({ value: "C1", disabled: false})
};
