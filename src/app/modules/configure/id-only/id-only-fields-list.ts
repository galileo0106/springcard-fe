// @ts-ignore
import { UntypedFormGroup } from '@angular/forms';
// @ts-ignore
import { getFieldValue } from '@shared/appSettings';

// @ts-ignore
export function Id_only_getFieldsList(formFields: UntypedFormGroup): string[] {
 // Les champs qui n'ont pas de conditions et qu'il faut donc lire dans tous les cas
 const fieldsList = [
  'tpl24hhu7n_reg0001_slszjhl',
  'tpl24hhu7n_reg0001_rsfphul',
  'tpl24hhu7n_reg0001_4hgd4jd',
  'tpl24hhu7n_reg0001_ytndzhn',
  'tpl24hhu7n_reg0003_rj665vl',
  'tpl24hhu7n_reg0003_gpg5rzd',
  'tpl24hhu7n_reg0004_g65secl',
  'tpl24hhu7n_reg0004_rgq7qed_efr3mkd',
  'tpl24hhu7n_reg0004_khxezgy',
  'tpl24hhu7n_reg0002',
  ];

  return fieldsList;
}

