// @ts-ignore
import { UntypedFormGroup } from '@angular/forms';
// @ts-ignore
import { getFieldValue } from '@shared/appSettings';

// @ts-ignore
export function Ndef_data_getFieldsList(formFields: UntypedFormGroup): string[] {
 // Les champs qui n'ont pas de conditions et qu'il faut donc lire dans tous les cas
 const fieldsList = [
  'tpl25z45sd_reg0005_5znnnnn',
  'tpl25z45sd_reg0006',
  'tpl25z45sd_reg0001_ut4pn2n_2kglign',
  'tpl25z45sd_reg0001_ut4pn2n_7wdxe6d',
  'tpl25z45sd_reg0001_ut4pn2n_rsfphul',
  'tpl25z45sd_reg0001_ut4pn2n_4hgd4jd',
  'tpl25z45sd_reg0001_ut4pn2n_ytndzhn',
  'tpl25z45sd_reg0001_oahnb5l_2kglign',
  'tpl25z45sd_reg0001_oahnb5l_7wdxe6d',
  'tpl25z45sd_reg0001_oahnb5l_rsfphul',
  'tpl25z45sd_reg0001_oahnb5l_4hgd4jd',
  'tpl25z45sd_reg0001_ovqgvtl_ytndzhn',
  'tpl25z45sd_reg0001_inpjjkn_gpg5rzd',
  'tpl25z45sd_reg0003_rj665vl',
  'tpl25z45sd_reg0003_gpg5rzd',
  'tpl25z45sd_reg0004_g65secl',
  'tpl25z45sd_reg0004_rgq7qed_efr3mkd',
  'tpl25z45sd_reg0004_khxezgy',
  'tpl25z45sd_reg0002',
  ];

  return fieldsList;
}

