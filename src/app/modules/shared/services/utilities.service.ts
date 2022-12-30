import { Injectable } from '@angular/core';

/**
 * Misc utilities
 */
export interface IUnstructuredJsonContent {
  [key: string]: string;
}

@Injectable()
export class UtilitiesProvider {
  constructor() {}

  getFilenameFromUrl(url: string) {
    if (url) {
      const m = url.substring(url.lastIndexOf('/') + 1);
      return m.replace('.' + this.getFileExtension(url), '');
    }
    return '';
  }

  getFileExtension(file: string) {
    return file.split('.').pop();
  }

  fromUnstructedJsonToStructuredJson(res: IUnstructuredJsonContent) {
    return Object.keys(res).map((key) => {
      return { key, value: res[key] };
    });
  }
}
