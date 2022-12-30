import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Mifare_plus_sl3FormGroup = {
    lookups: new UntypedFormControl({ value: "63", disabled: false}, [Validators.required]),
    id8321_Lkl: new UntypedFormControl({ value: "63", disabled: false}),
    tplvsbmlpn_reg0003_rk4phyn: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplvsbmlpn_reg0003_2bahmzn: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplvsbmlpn_reg0003_3ovnoey: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0003_ahd4scn: new UntypedFormControl({ value: "", disabled: false}),
    id8330_Note: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0005_fgspoil: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0005_qqotlql: new UntypedFormControl({ value: "0", disabled: false}),
    tplvsbmlpn_reg0005_zawhwsy: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0005_mbubfud: new UntypedFormControl({ value: "0", disabled: false}),
    tplvsbmlpn_reg0005_ax6yead: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0005_czjfdty_yq2hdrd: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplvsbmlpn_reg0005_mywaqkd_vjputzd: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplvsbmlpn_reg0001_ut4pn2n_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_ut4pn2n_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_ut4pn2n_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_ut4pn2n_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_ut4pn2n_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_oahnb5l_2kglign: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_oahnb5l_7wdxe6d: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_oahnb5l_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_oahnb5l_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_ovqgvtl_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0001_inpjjkn_gpg5rzd: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0004_g65secl: new UntypedFormControl({ value: "0", disabled: false}),
    tplvsbmlpn_reg0004_rgq7qed_efr3mkd: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0004_khxezgy: new UntypedFormControl({ value: "", disabled: false}),
    tplvsbmlpn_reg0002: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(8)])
};
