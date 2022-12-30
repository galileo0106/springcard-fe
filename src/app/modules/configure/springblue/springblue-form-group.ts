import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const SpringblueFormGroup = {
    lookups: new UntypedFormControl({ value: "B0", disabled: false}, [Validators.required]),
    id8612_Lkl: new UntypedFormControl({ value: "B0", disabled: false})
};
