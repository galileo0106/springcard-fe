// @ts-ignore
import { UntypedFormGroup } from '@angular/forms';
// @ts-ignore
import { getFieldValue } from '@shared/appSettings';

// @ts-ignore
export function Mifare_ultralight_getFieldsList(formFields: UntypedFormGroup): string[] {
 // Les champs qui n'ont pas de conditions et qu'il faut donc lire dans tous les cas
 const fieldsList = [
  'tplzyob5bl_reg0003_lmh6e5y',
  'tplzyob5bl_reg0003_gsqqlyn',
  'tplzyob5bl_reg0003_rk4pgmy',
  'tplzyob5bl_reg0001_ut4pn2n_2kglign',
  'tplzyob5bl_reg0001_ut4pn2n_7wdxe6d',
  'tplzyob5bl_reg0001_ut4pn2n_rsfphul',
  'tplzyob5bl_reg0001_ut4pn2n_4hgd4jd',
  'tplzyob5bl_reg0001_ut4pn2n_ytndzhn',
  'tplzyob5bl_reg0001_oahnb5l_2kglign',
  'tplzyob5bl_reg0001_oahnb5l_7wdxe6d',
  'tplzyob5bl_reg0001_oahnb5l_rsfphul',
  'tplzyob5bl_reg0001_oahnb5l_4hgd4jd',
  'tplzyob5bl_reg0001_ovqgvtl_ytndzhn',
  'tplzyob5bl_reg0001_inpjjkn_gpg5rzd',
  'tplzyob5bl_reg0004_g65secl',
  'tplzyob5bl_reg0004_rgq7qed_efr3mkd',
  'tplzyob5bl_reg0004_khxezgy',
  'tplzyob5bl_reg0002',
  ];

  return fieldsList;
}

