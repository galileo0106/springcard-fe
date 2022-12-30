import { Pipe, PipeTransform } from '@angular/core';

/**
 * Remplace les booléns pas Oui / Non
 */
@Pipe({
  name: 'yesNo',
})
export class YesNoPipe implements PipeTransform {
  // @ts-ignore
  transform(value: any, ...args: any[]) {
    if (value === null) {
      return '';
    }
    return value ? $localize`Yes` : $localize`No`;
  }
}
