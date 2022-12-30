import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Apple_vasFormGroup = {
    lookups: new UntypedFormControl({ value: "D1", disabled: false}, [Validators.required]),
    id8624_Lkl: new UntypedFormControl({ value: "D1", disabled: false}),
    tplql55h6y_reg0006: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null), Validators.minLength(0), Validators.maxLength(64)]),
    tplql55h6y_reg0007: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null), Validators.minLength(2), Validators.maxLength(2)]),
    tplql55h6y_reg0008_5jmntfy: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplql55h6y_reg0008_5a737by: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplql55h6y_reg0009: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null), Validators.minLength(0), Validators.maxLength(64)]),
    tplql55h6y_reg000a: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null), Validators.minLength(2), Validators.maxLength(2)]),
    tplql55h6y_reg000b_5jmntfy: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplql55h6y_reg000b_5a737by: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplql55h6y_reg0001_ut4pn2n_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_ut4pn2n_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_ut4pn2n_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_ut4pn2n_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_ut4pn2n_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_oahnb5l_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_oahnb5l_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_oahnb5l_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_oahnb5l_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_ovqgvtl_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0001_inpjjkn_gpg5rzd: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0004_g65secl: new UntypedFormControl({ value: "0", disabled: false}),
    tplql55h6y_reg0004_rgq7qed_efr3mkd: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0004_khxezgy: new UntypedFormControl({ value: "", disabled: false}),
    tplql55h6y_reg0002: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(8)])
};
