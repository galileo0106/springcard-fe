import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Desfire_idFormGroup = {
    lookups: new UntypedFormControl({ value: "70", disabled: false}, [Validators.required]),
    id7977_Lkl: new UntypedFormControl({ value: "70", disabled: false}),
    tplhvnvpdd_reg0001_slszjhl: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0001_rsfphul: new UntypedFormControl({ value: "0", disabled: false}),
    tplhvnvpdd_reg0001_4hgd4jd: new UntypedFormControl({ value: "0", disabled: false}),
    tplhvnvpdd_reg0001_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0003_gpgdxvl: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplhvnvpdd_reg0003_3ovnoey: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0003_ahd4scn: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0005_gobxoml_f26ipjn: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0005_hsgqnhd_bp5b7tl: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0005_hsgqnhd_qxqw7kl: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplhvnvpdd_reg0005_gtnexal_ucsziid: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0005_owh5twn: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0005_kla24ed_gki2gwd: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplhvnvpdd_reg0005_hcjrwjl_7dkocnd: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null)]),
    tplhvnvpdd_reg0004_kxpbr2l: new UntypedFormControl({ value: "0", disabled: false}),
    tplhvnvpdd_reg0004_ax7h6sl: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0004_t6r55rl: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0004_rgq7qed_efr3mkd: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0004_khxezgy: new UntypedFormControl({ value: "", disabled: false}),
    tplhvnvpdd_reg0002: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(8)])
};
