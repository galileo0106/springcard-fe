import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service';

/**
 * Contains some methods/actions specifics to an application
 */
@Injectable()
export class ApplicationService {
  constructor(private electron: ElectronService, @Inject(DOCUMENT) readonly document: Document) {}

  get window(): Window | null {
    return this.document.defaultView;
  }

  appQuitOrCancel(): void {
    if (this.electron.isElectronApp()) {
      this.electron.quit();
    }
  }

  public redirect(url: string, target = '_blank'): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const window = this.window;
      if (window) {
        try {
          resolve(!!window.open(url, target));
        } catch (e) {
          reject(e);
        }
      }
    });
  }
}
