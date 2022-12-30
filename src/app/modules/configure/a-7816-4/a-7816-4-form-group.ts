import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const A_7816_4FormGroup = {
    lookups: new UntypedFormControl({ value: "", disabled: false}, [Validators.required]),
    id7756_Lkl: new UntypedFormControl({ value: "13", disabled: false}),
    id7757_Lkl: new UntypedFormControl({ value: "11", disabled: false}),
    id7758_Lkl: new UntypedFormControl({ value: "12", disabled: false}),
    id7759_Lkl: new UntypedFormControl({ value: "72", disabled: false}),
    tpl3n4zrpl_reg0005: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null), Validators.minLength(0), Validators.maxLength(64)]),
    tpl3n4zrpl_reg0006: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null), Validators.minLength(0), Validators.maxLength(64)]),
    tpl3n4zrpl_reg0007: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null), Validators.minLength(0), Validators.maxLength(64)]),
    tpl3n4zrpl_reg0001_ut4pn2n_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_ut4pn2n_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_ut4pn2n_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_ut4pn2n_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_ut4pn2n_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_oahnb5l_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_oahnb5l_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_oahnb5l_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_oahnb5l_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_ovqgvtl_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0001_inpjjkn_gpg5rzd: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0003_rj665vl: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0003_gpg5rzd: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0004_g65secl: new UntypedFormControl({ value: "0", disabled: false}),
    tpl3n4zrpl_reg0004_rgq7qed_efr3mkd: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0004_khxezgy: new UntypedFormControl({ value: "", disabled: false}),
    tpl3n4zrpl_reg0002: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(8)])
};
