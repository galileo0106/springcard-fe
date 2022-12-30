import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Ndef_dataFormGroup = {
    lookups: new UntypedFormControl({ value: "", disabled: false}, [Validators.required]),
    id7863_Lkl: new UntypedFormControl({ value: "4E", disabled: false}),
    id7864_Lkl: new UntypedFormControl({ value: "4F", disabled: false}),
    id7865_Lkl: new UntypedFormControl({ value: "41", disabled: false}),
    id7866_Lkl: new UntypedFormControl({ value: "42", disabled: false}),
    id7867_Lkl: new UntypedFormControl({ value: "43", disabled: false}),
    id7868_Lkl: new UntypedFormControl({ value: "44", disabled: false}),
    id7869_Lkl: new UntypedFormControl({ value: "45", disabled: false}),
    id7870_Lkl: new UntypedFormControl({ value: "4A", disabled: false}),
    id7871_Lkl: new UntypedFormControl({ value: "4B", disabled: false}),
    id7872_Lkl: new UntypedFormControl({ value: "40", disabled: false}),
    tpl25z45sd_reg0005_5znnnnn: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0006: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(32)]),
    tpl25z45sd_reg0001_ut4pn2n_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_ut4pn2n_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_ut4pn2n_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_ut4pn2n_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_ut4pn2n_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_oahnb5l_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_oahnb5l_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_oahnb5l_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_oahnb5l_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_ovqgvtl_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0001_inpjjkn_gpg5rzd: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0003_rj665vl: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0003_gpg5rzd: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0004_g65secl: new UntypedFormControl({ value: "0", disabled: false}),
    tpl25z45sd_reg0004_rgq7qed_efr3mkd: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0004_khxezgy: new UntypedFormControl({ value: "", disabled: false}),
    tpl25z45sd_reg0002: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(8)])
};
