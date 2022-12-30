import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { getServiceUrl } from '@shared/appSettings';
import { map, filter } from 'rxjs/operators';
import { IPcScReadersList } from '@shared/models/Pcsc/ipcscreaderslist.model';

/**
 * Low level service used to open, receive, send and close a websocket
 */
@Injectable()
export class WsService {
  private ws: WebSocket;

  constructor() {}

  public connect(url: string) {
    this.ws = new WebSocket(url);
    return new Observable((obs: Observer<MessageEvent>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.error.bind(obs);
      return () => {
        this.ws.close();
      };
    });
  }

  listenForDevicesListChanges() {
    return this.connect(getServiceUrl('WSS_URL')).pipe(
      map((data) => JSON.parse(data.data)),
      filter((data) => data.event === 'Devices.ListChange'),
    );
  }

  filterDeviceAndSlotMessages(readerId: string): Observable<IPcScReadersList> {
    return this.connect(getServiceUrl('WSS_URL')).pipe(
      map((data) => JSON.parse(data.data)),
      filter((data) => data.event === 'Pcsc.Reader.StateChange'),
      filter((data) => data.params.ReaderId === readerId),
      map((data) => data.params),
    );
  }
}
