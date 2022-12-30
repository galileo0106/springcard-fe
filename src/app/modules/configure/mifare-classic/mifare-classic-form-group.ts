import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Mifare_classicFormGroup = {
    lookups: new UntypedFormControl({ value: "61", disabled: false}, [Validators.required]),
    id8222_Lkl: new UntypedFormControl({ value: "61", disabled: false}),
    tplnqitimn_reg0001_ut4pn2n_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_ut4pn2n_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_ut4pn2n_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_ut4pn2n_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_ut4pn2n_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_oahnb5l_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_oahnb5l_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_oahnb5l_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_oahnb5l_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_ovqgvtl_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0001_inpjjkn_gpg5rzd: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0002: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(8)]),
    tplnqitimn_reg0003_rk4phyn: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplnqitimn_reg0003_2bahmzn: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplnqitimn_reg0003_3ovnoey: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0003_ahd4scn: new UntypedFormControl({ value: "", disabled: false}),
    id8297_Note: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0004_g65secl: new UntypedFormControl({ value: "0", disabled: false}),
    tplnqitimn_reg0004_rgq7qed_efr3mkd: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0004_khxezgy: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0005_biavjvn: new UntypedFormControl({ value: "", disabled: false}),
    tplnqitimn_reg0005_dawm52n: new UntypedFormControl({ value: "00", disabled: false}),
    tplnqitimn_reg0005_gietmul: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)])
};
