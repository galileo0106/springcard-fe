// @ts-ignore
import { UntypedFormGroup } from '@angular/forms';
// @ts-ignore
import { getFieldValue } from '@shared/appSettings';

// @ts-ignore
export function Iso_15693_memory_getFieldsList(formFields: UntypedFormGroup): string[] {
 // Les champs qui n'ont pas de conditions et qu'il faut donc lire dans tous les cas
 const fieldsList = [
  'tplsoaav3l_reg0003_lmh6e5y',
  'tplsoaav3l_reg0003_gsqqlyn',
  'tplsoaav3l_reg0003_rk4pgmy',
  'tplsoaav3l_reg0001_ut4pn2n_2kglign',
  'tplsoaav3l_reg0001_ut4pn2n_7wdxe6d',
  'tplsoaav3l_reg0001_ut4pn2n_rsfphul',
  'tplsoaav3l_reg0001_ut4pn2n_4hgd4jd',
  'tplsoaav3l_reg0001_ut4pn2n_ytndzhn',
  'tplsoaav3l_reg0001_oahnb5l_2kglign',
  'tplsoaav3l_reg0001_oahnb5l_7wdxe6d',
  'tplsoaav3l_reg0001_oahnb5l_rsfphul',
  'tplsoaav3l_reg0001_oahnb5l_4hgd4jd',
  'tplsoaav3l_reg0001_ovqgvtl_ytndzhn',
  'tplsoaav3l_reg0001_inpjjkn_gpg5rzd',
  'tplsoaav3l_reg0004_g65secl',
  'tplsoaav3l_reg0004_rgq7qed_efr3mkd',
  'tplsoaav3l_reg0004_khxezgy',
  'tplsoaav3l_reg0002',
  ];

  return fieldsList;
}

