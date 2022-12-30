import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Permet de réagir aux clics sur les boutons créés dans DeviceInformationsComponent (en haut de page et pas en haut d'écran)
 */
@Injectable({
  providedIn: 'root',
})
export class DeviceInformationsButtonsService {
  observer = new Subject();
  advancedobserver = new Subject();
  public subscriber$ = this.observer.asObservable();
  public advanced$ = this.advancedobserver.asObservable();

  constructor() {}

  emitData(data: string) {
    this.observer.next(data);
  }

  saveAdvancedState(data: boolean) {
    this.advancedobserver.next(data);
  }
}
