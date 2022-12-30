import { Pipe, PipeTransform } from '@angular/core';

/**
 * Remove some characters from a JSON string to get a better version for display
 */
@Pipe({
  name: 'displayableJson',
})
export class DisplayablejsonPipe implements PipeTransform {
  // @ts-ignore
  transform(value: string, ...args: any[]) {
    if (!value) {
      return '';
    }
    return value.replace(/{|}|"/gm, '');
  }
}
