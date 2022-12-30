import { Pipe, PipeTransform } from '@angular/core';
import { fromIso8601toJsDate } from '@shared/appSettings';

/**
 * Converts a decimal value to an hexadecimal value
 */
@Pipe({
  name: 'iso8601toJsDate',
})
export class Iso8601toJsDate implements PipeTransform {
  // @ts-ignore
  transform(value: string, withTime = true) {
    if (value === null || value.trim() === '') {
      return '';
    }
    const jsDate = fromIso8601toJsDate(value, true);
    if (withTime) {
      return jsDate.toLocaleDateString() + ' ' + jsDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return jsDate.toLocaleDateString();
    }
  }
}
