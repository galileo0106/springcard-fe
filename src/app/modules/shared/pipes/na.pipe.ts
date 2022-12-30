import { Pipe, PipeTransform } from '@angular/core';

/**
 * Remplace les valeurs vides par n/a
 */
@Pipe({
  name: 'na',
})
export class NaPipe implements PipeTransform {
  // @ts-ignore
  transform(value: any, ...args: any[]) {
    return value ? value : $localize`n/a`;
  }
}
