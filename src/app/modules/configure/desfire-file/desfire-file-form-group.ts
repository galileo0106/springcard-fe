import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Desfire_fileFormGroup = {
    lookups: new UntypedFormControl({ value: "71", disabled: false}, [Validators.required]),
    id8062_Lkl: new UntypedFormControl({ value: "71", disabled: false}),
    tpl2gev7yd_reg0003_gucejpy: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tpl2gev7yd_reg0003_x6j525l: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0003_xdeivrd: new UntypedFormControl({ value: "0", disabled: false}),
    tpl2gev7yd_reg0003_ds32kfn: new UntypedFormControl({ value: "0", disabled: false}),
    tpl2gev7yd_reg0003_bu44smy: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tpl2gev7yd_reg0003_bhudxsy: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tpl2gev7yd_reg0003_jokxtwy: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tpl2gev7yd_reg0003_fbuk34n: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0003_trcl26y: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0005_gobxoml_f26ipjn: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0005_hsgqnhd_bp5b7tl: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0005_hsgqnhd_qxqw7kl: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tpl2gev7yd_reg0005_gtnexal_ucsziid: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0005_owh5twn: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0005_kla24ed_gki2gwd: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tpl2gev7yd_reg0005_hcjrwjl_7dkocnd: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tpl2gev7yd_reg0004_kxpbr2l: new UntypedFormControl({ value: "0", disabled: false}),
    tpl2gev7yd_reg0004_ax7h6sl: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0004_t6r55rl: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0004_rgq7qed_efr3mkd: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0004_khxezgy: new UntypedFormControl({ value: "", disabled: false}),
    tpl2gev7yd_reg0002: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(8)])
};
