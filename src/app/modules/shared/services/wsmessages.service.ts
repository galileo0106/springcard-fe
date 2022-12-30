import { Injectable } from '@angular/core';
import { getServiceUrl } from '@shared/appSettings';
import { IJsonRpc } from '@shared/models/jsonrpc.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WsService } from './ws.service';

/**
 * Service used to open a connection to the websocket and to send filtered messages
 */
@Injectable()
export class WsmessagesService {
  private historyCountInitialValue = 20;
  private subscription: Subscription;
  private messages: any;
  private messagesPushed = 0;
  public behaviorMessages = new BehaviorSubject([]);
  private isPaused = false;
  private messagesHistoryCount = this.historyCountInitialValue;

  constructor(private wsService: WsService) {}

  /**
   * Parse the JSON returned from the WS to a JsonRpc structure
   */
  parseJson(jsonAsString: string): IJsonRpc | null {
    /*if (jsonAsString.trim().toLowerCase().indexOf('error') !== -1) {
      return null;
    }*/

    try {
      const data = JSON.parse(jsonAsString);
      const deviceEvent: IJsonRpc = {
        jsonrpc: data.jsonrpc,
        timestamp: new Date().toLocaleString(),
        event: data.event,
        params: data.params,
      };
      return deviceEvent;
    } catch (error) {
      console.error('Invalid JSON');
      console.error(error);
      console.error(jsonAsString);
      return null;
    }
  }

  /**
   * Add a new event to the queue
   *
   * @param deviceEvent event
   */
  private pushDeviceEvent(deviceEvent: IJsonRpc): void {
    this.messagesPushed++;
    if (this.messagesPushed > this.messagesHistoryCount) {
      this.messagesPushed = this.messagesHistoryCount;
      this.messages = this.messages.slice(0, this.messagesHistoryCount);
    }

    this.messages = [deviceEvent, ...this.messages];
    if (!this.isPaused) {
      this.behaviorMessages.next(this.messages);
    }
  }

  /**
   * Filter some specific events for a specified device
   */
  public filterMessagesForDevice(deviceId: string, eventsNames?: string[], readerId?: string) {
    this.behaviorMessages = new BehaviorSubject([]);
    this.messages = new Array();
    this.subscription = this.wsService.connect(getServiceUrl('WSS_URL')).subscribe({
      next: (response) => {
        const deviceEvent = this.parseJson(response.data);
        if (!deviceEvent) {
          console.error('Error while parsing JSON data');
          return;
        }
        const params = deviceEvent.params;
        if (!params) {
          console.error('Error deviceEvent.params are not set');
          return;
        }

        if (readerId) {
          if (!params.hasOwnProperty('DeviceId') && !params.hasOwnProperty('ReaderId') && eventsNames && eventsNames.length === 0) {
            console.error('Error missing DeviceId and ReaderId and eventsName length == 0');
            return;
          }
        }

        // @ts-ignore
        if (params.hasOwnProperty('DeviceId') && deviceEvent.params['DeviceId'] !== deviceId) {
          return;
        }
        // @ts-ignore
        if (readerId && params.hasOwnProperty('ReaderId') && deviceEvent.params['ReaderId'] !== readerId) {
          return;
        }

        let canSend = false;
        if (eventsNames && eventsNames.length > 0) {
          eventsNames.forEach((eventName) => {
            if (eventName.trim().toLowerCase() === deviceEvent.event.trim().toLowerCase()) {
              canSend = true;
            }
          });
        } else {
          canSend = true;
        }
        if (canSend) {
          this.pushDeviceEvent(deviceEvent);
        }
      },
      error: (err) => {
        this.behaviorMessages.error(err);
      },
      complete: () => {
        this.behaviorMessages.complete();
      },
    });

    return this.behaviorMessages.asObservable();
  }

  public stopListening() {
    this.isPaused = false;
    this.messages = new Array();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.behaviorMessages) {
      this.behaviorMessages.complete();
    }
    this.behaviorMessages = new BehaviorSubject([]);
  }

  public pause(): void {
    this.isPaused = true;
  }

  public unpause(): void {
    this.isPaused = false;
  }

  public setMessagesHistoryCount(count: number) {
    this.messagesHistoryCount = count;
  }

  public getMessagesHistoryCount(): number {
    return this.messagesHistoryCount;
  }

  public resetMessagesHistoryCount(): void {
    this.messagesHistoryCount = this.historyCountInitialValue;
  }

  /**
   * Get all messages from the WS without filtering anything
   */
  public getAllMessages() {
    this.behaviorMessages = new BehaviorSubject([]);
    this.messages = new Array();
    this.subscription = this.wsService.connect(getServiceUrl('WSS_URL')).subscribe({
      next: (response) => {
        const deviceEvent = this.parseJson(response.data);
        if (!deviceEvent) {
          return;
        }
        this.pushDeviceEvent(deviceEvent);
      },
      error: (err) => {
        this.behaviorMessages.error(err);
      },
      complete: () => {
        this.behaviorMessages.complete();
      },
    });
    return this.behaviorMessages.asObservable();
  }
}
