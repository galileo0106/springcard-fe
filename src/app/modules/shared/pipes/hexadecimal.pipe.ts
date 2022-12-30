import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts a decimal value to an hexadecimal value
 */
@Pipe({
  name: 'hexadecimal',
})
export class HexadecimalPipe implements PipeTransform {
  // @ts-ignore
  transform(value: number | number, ...args: any[]) {
    //const inValue: number = parseInt(value, 10);
    return value.toString(16).toUpperCase();
  }
}
