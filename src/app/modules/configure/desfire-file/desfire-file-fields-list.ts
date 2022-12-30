// @ts-ignore
import { UntypedFormGroup } from '@angular/forms';
// @ts-ignore
import { getFieldValue } from '@shared/appSettings';

// @ts-ignore
export function Desfire_file_getFieldsList(formFields: UntypedFormGroup): string[] {
 // Les champs qui n'ont pas de conditions et qu'il faut donc lire dans tous les cas
 const fieldsList = [
  'tpl2gev7yd_reg0003_gucejpy',
  'tpl2gev7yd_reg0003_x6j525l',
  'tpl2gev7yd_reg0003_xdeivrd',
  'tpl2gev7yd_reg0003_ds32kfn',
  'tpl2gev7yd_reg0003_bu44smy',
  'tpl2gev7yd_reg0003_bhudxsy',
  'tpl2gev7yd_reg0003_jokxtwy',
  'tpl2gev7yd_reg0003_fbuk34n',
  'tpl2gev7yd_reg0003_trcl26y',
  'tpl2gev7yd_reg0005_gobxoml_f26ipjn',
  'tpl2gev7yd_reg0005_hsgqnhd_bp5b7tl',
  'tpl2gev7yd_reg0005_hsgqnhd_qxqw7kl',
  'tpl2gev7yd_reg0005_gtnexal_ucsziid',
  'tpl2gev7yd_reg0005_owh5twn',
  'tpl2gev7yd_reg0005_kla24ed_gki2gwd',
  'tpl2gev7yd_reg0005_hcjrwjl_7dkocnd',
  'tpl2gev7yd_reg0004_kxpbr2l',
  'tpl2gev7yd_reg0004_ax7h6sl',
  'tpl2gev7yd_reg0004_t6r55rl',
  'tpl2gev7yd_reg0004_rgq7qed_efr3mkd',
  'tpl2gev7yd_reg0004_khxezgy',
  'tpl2gev7yd_reg0002',
  ];

  return fieldsList;
}

