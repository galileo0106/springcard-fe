import { Injectable } from '@angular/core';

/**
 * Gestion simple et rapide de la localStorage
 */
@Injectable()
export class SettingsService {
  constructor() {}

  get(keyName: string, defaultValue: string | boolean | number | null = '') {
    const value = localStorage.getItem('sc_' + keyName);
    if (!value) {
      return defaultValue;
    } else {
      return value;
    }
  }

  getBoolean(keyName: string, defaultValue: boolean): boolean {
    const value = localStorage.getItem('sc_' + keyName);
    if (!value) {
      return defaultValue;
    }
    return value.trim().toLowerCase() === 'false' ? false : true;
  }

  set(keyName: string, value: string) {
    localStorage.setItem('sc_' + keyName, value);
  }
}
