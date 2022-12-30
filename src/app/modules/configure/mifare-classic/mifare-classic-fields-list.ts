// @ts-ignore
import { UntypedFormGroup } from '@angular/forms';
// @ts-ignore
import { getFieldValue } from '@shared/appSettings';

// @ts-ignore
export function Mifare_classic_getFieldsList(formFields: UntypedFormGroup): string[] {
 // Les champs qui n'ont pas de conditions et qu'il faut donc lire dans tous les cas
 const fieldsList = [
  'tplnqitimn_reg0001_ut4pn2n_2kglign',
  'tplnqitimn_reg0001_ut4pn2n_7wdxe6d',
  'tplnqitimn_reg0001_ut4pn2n_rsfphul',
  'tplnqitimn_reg0001_ut4pn2n_4hgd4jd',
  'tplnqitimn_reg0001_ut4pn2n_ytndzhn',
  'tplnqitimn_reg0001_oahnb5l_2kglign',
  'tplnqitimn_reg0001_oahnb5l_7wdxe6d',
  'tplnqitimn_reg0001_oahnb5l_rsfphul',
  'tplnqitimn_reg0001_oahnb5l_4hgd4jd',
  'tplnqitimn_reg0001_ovqgvtl_ytndzhn',
  'tplnqitimn_reg0001_inpjjkn_gpg5rzd',
  'tplnqitimn_reg0002',
  'tplnqitimn_reg0003_rk4phyn',
  'tplnqitimn_reg0003_2bahmzn',
  'tplnqitimn_reg0003_3ovnoey',
  'tplnqitimn_reg0003_ahd4scn',
  'tplnqitimn_reg0004_g65secl',
  'tplnqitimn_reg0004_rgq7qed_efr3mkd',
  'tplnqitimn_reg0004_khxezgy',
  'tplnqitimn_reg0005_biavjvn',
  'tplnqitimn_reg0005_dawm52n',
  'tplnqitimn_reg0005_gietmul',
  ];

  return fieldsList;
}

