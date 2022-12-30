// @ts-ignore
import { UntypedFormGroup } from '@angular/forms';
// @ts-ignore
import { getFieldValue } from '@shared/appSettings';

// @ts-ignore
export function IndividualsGetFieldsList(formFields: UntypedFormGroup): string[] {
 // Les champs qui n'ont pas de conditions et qu'il faut donc lire dans tous les cas
 const fieldsList = [
  'reg0201',
  'reg0202',
  'reg0209',
  'reg020a',
  'reg0281',
  'reg02fe',
  'reg02ff',
  'reg0244',
  ];
 if (getFieldValue(formFields, 'dhcpStatic_0280') === 'static') {
  fieldsList.push('reg0280_555555y');
  fieldsList.push('reg0280_vqlq6ky');
  fieldsList.push('reg0280_s25rcml');
  fieldsList.push('reg0280_qocj7wy');
  fieldsList.push('reg0280_rxuj7ed');
  }

  return fieldsList;
}

