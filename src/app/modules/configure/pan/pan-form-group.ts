import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const PanFormGroup = {
    lookups: new UntypedFormControl({ value: "73", disabled: false}, [Validators.required]),
    id8736_Lkl: new UntypedFormControl({ value: "73", disabled: false})
};
