import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Google_smarttapFormGroup = {
    lookups: new UntypedFormControl({ value: "D2", disabled: false}, [Validators.required]),
    id8733_Lkl: new UntypedFormControl({ value: "D2", disabled: false})
};
