import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Em4134_memoryFormGroup = {
    lookups: new UntypedFormControl({ value: "56", disabled: false}, [Validators.required]),
    id8523_Lkl: new UntypedFormControl({ value: "56", disabled: false}),
    tplphfd7cn_reg0003_lmh6e5y: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplphfd7cn_reg0003_gsqqlyn: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0003_rk4pgmy: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_ut4pn2n_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_ut4pn2n_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_ut4pn2n_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_ut4pn2n_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_ut4pn2n_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_oahnb5l_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_oahnb5l_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_oahnb5l_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_oahnb5l_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_ovqgvtl_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0001_inpjjkn_gpg5rzd: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0004_g65secl: new UntypedFormControl({ value: "0", disabled: false}),
    tplphfd7cn_reg0004_rgq7qed_efr3mkd: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0004_khxezgy: new UntypedFormControl({ value: "", disabled: false}),
    tplphfd7cn_reg0002: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(8)])
};
