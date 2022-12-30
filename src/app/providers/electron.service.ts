import { Injectable } from '@angular/core';

/**
 * This service exists to keep an identical behaviour between the Angular version and the Electron version
 */
@Injectable()
export class ElectronService {
  ipcRenderer: {};

  constructor() {}

  public isElectronApp(): boolean {
    return false;
  }

  public quit(): void {
    console.info('Quitting application');
  }
}
