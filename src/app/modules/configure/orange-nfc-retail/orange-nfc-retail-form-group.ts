import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Orange_nfc_retailFormGroup = {
    lookups: new UntypedFormControl({ value: "C0", disabled: false}, [Validators.required]),
    id8616_Lkl: new UntypedFormControl({ value: "C0", disabled: false})
};
