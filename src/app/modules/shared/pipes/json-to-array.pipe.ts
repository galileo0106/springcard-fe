import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts a json object to an iterable array of [key:'', value:'']
 */
@Pipe({
  name: 'jsonToArray',
})
export class JsonToArrayPipe implements PipeTransform {
  transform(value: any, replaceComma?: boolean): any {
    value = JSON.parse(value);
    const keys = [{}];
    for (const objectKey of Object.keys(value)) {
      if (value[objectKey]) {
        let newValue = value[objectKey].toString();
        if (replaceComma) {
          newValue = newValue.replace(/,/gm, '\n');
        }
        keys.push({ key: objectKey, value: newValue });
      } else {
        keys.push({ key: objectKey, value: '' });
      }
    }
    return keys;
  }
}
