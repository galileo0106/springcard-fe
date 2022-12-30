import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const Id_onlyFormGroup = {
    lookups: new UntypedFormControl({ value: "", disabled: false}, [Validators.required]),
    id7684_Lkl: new UntypedFormControl({ value: "FF", disabled: false}),
    id7685_Lkl: new UntypedFormControl({ value: "01", disabled: false}),
    id7686_Lkl: new UntypedFormControl({ value: "02", disabled: false}),
    id7687_Lkl: new UntypedFormControl({ value: "03", disabled: false}),
    id7688_Lkl: new UntypedFormControl({ value: "04", disabled: false}),
    id7689_Lkl: new UntypedFormControl({ value: "07", disabled: false}),
    id7690_Lkl: new UntypedFormControl({ value: "08", disabled: false}),
    id7691_Lkl: new UntypedFormControl({ value: "0F", disabled: false}),
    id7692_Lkl: new UntypedFormControl({ value: "20", disabled: false}),
    id7693_Lkl: new UntypedFormControl({ value: "21", disabled: false}),
    id7694_Lkl: new UntypedFormControl({ value: "22", disabled: false}),
    id7695_Lkl: new UntypedFormControl({ value: "23", disabled: false}),
    id7696_Lkl: new UntypedFormControl({ value: "24", disabled: false}),
    id7697_Lkl: new UntypedFormControl({ value: "28", disabled: false}),
    id7698_Lkl: new UntypedFormControl({ value: "2A", disabled: false}),
    id7699_Lkl: new UntypedFormControl({ value: "2C", disabled: false}),
    tpl24hhu7n_reg0001_slszjhl: new UntypedFormControl({ value: "", disabled: false}),
    tpl24hhu7n_reg0001_rsfphul: new UntypedFormControl({ value: "", disabled: false}),
    tpl24hhu7n_reg0001_4hgd4jd: new UntypedFormControl({ value: "", disabled: false}),
    tpl24hhu7n_reg0001_ytndzhn: new UntypedFormControl({ value: "", disabled: false}),
    tpl24hhu7n_reg0003_rj665vl: new UntypedFormControl({ value: "", disabled: false}),
    tpl24hhu7n_reg0003_gpg5rzd: new UntypedFormControl({ value: "", disabled: false}),
    tpl24hhu7n_reg0004_g65secl: new UntypedFormControl({ value: "0", disabled: false}),
    tpl24hhu7n_reg0004_rgq7qed_efr3mkd: new UntypedFormControl({ value: "", disabled: false}),
    tpl24hhu7n_reg0004_khxezgy: new UntypedFormControl({ value: "", disabled: false}),
    tpl24hhu7n_reg0002: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(8)])
};
