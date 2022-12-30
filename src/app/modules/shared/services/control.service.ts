import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getServiceUrl, getTimeout } from '@shared/appSettings';
import { IControl } from '@shared/models/Device/control.model';
import { IUi } from '@shared/models/UI/ui.model';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

/**
 * Service utilisé pour contrôler les périphériques (démarrer, arrêter, beep, blink, etc)
 */
@Injectable()
export class ControlService {
  constructor(private http: HttpClient) {}

  winkDevice(deviceId: string): Observable<any> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/wink';
    return this.http.post<IControl>(route, null).pipe(timeout(getTimeout()));
  }

  /**
   * Start or stop a reader
   */
  setReaderStatus(deviceId: string, status: string): Observable<any> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/reader/' + status;
    return this.http.post<IControl>(route, null).pipe(timeout(getTimeout()));
  }

  /**
   * Controls a device's UI (Color, Pattern, Buzzer)
   */
  ControlDeviceUi(deviceId: string, ui: IUi): Observable<any> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/ui';
    return this.http.post<IControl>(route, ui).pipe(timeout(getTimeout()));
  }

  /**
   * Shortcut to ask a device to beep
   */
  beepDevice(deviceId: string): Observable<any> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/ui';
    return this.http.post<IControl>(route, { Buzzer: 250 }).pipe(timeout(getTimeout()));
  }
}
