// @ts-ignore
import { UntypedFormGroup } from '@angular/forms';
// @ts-ignore
import { getFieldValue } from '@shared/appSettings';

// @ts-ignore
export function Mifare_plus_sl3_getFieldsList(formFields: UntypedFormGroup): string[] {
 // Les champs qui n'ont pas de conditions et qu'il faut donc lire dans tous les cas
 const fieldsList = [
  'tplvsbmlpn_reg0003_rk4phyn',
  'tplvsbmlpn_reg0003_2bahmzn',
  'tplvsbmlpn_reg0003_3ovnoey',
  'tplvsbmlpn_reg0003_ahd4scn',
  'tplvsbmlpn_reg0005_fgspoil',
  'tplvsbmlpn_reg0005_qqotlql',
  'tplvsbmlpn_reg0005_zawhwsy',
  'tplvsbmlpn_reg0005_mbubfud',
  'tplvsbmlpn_reg0005_ax6yead',
  'tplvsbmlpn_reg0005_czjfdty_yq2hdrd',
  'tplvsbmlpn_reg0005_mywaqkd_vjputzd',
  'tplvsbmlpn_reg0001_ut4pn2n_2kglign',
  'tplvsbmlpn_reg0001_ut4pn2n_7wdxe6d',
  'tplvsbmlpn_reg0001_ut4pn2n_rsfphul',
  'tplvsbmlpn_reg0001_ut4pn2n_4hgd4jd',
  'tplvsbmlpn_reg0001_ut4pn2n_ytndzhn',
  'tplvsbmlpn_reg0001_oahnb5l_2kglign',
  'tplvsbmlpn_reg0001_oahnb5l_7wdxe6d',
  'tplvsbmlpn_reg0001_oahnb5l_rsfphul',
  'tplvsbmlpn_reg0001_oahnb5l_4hgd4jd',
  'tplvsbmlpn_reg0001_ovqgvtl_ytndzhn',
  'tplvsbmlpn_reg0001_inpjjkn_gpg5rzd',
  'tplvsbmlpn_reg0004_g65secl',
  'tplvsbmlpn_reg0004_rgq7qed_efr3mkd',
  'tplvsbmlpn_reg0004_khxezgy',
  'tplvsbmlpn_reg0002',
  ];

  return fieldsList;
}

