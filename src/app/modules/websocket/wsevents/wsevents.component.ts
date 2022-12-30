import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@shared/classes/Device';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { IButtonClick } from '@shared/models/UI/ibuttonclick.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { WsmessagesService } from '@shared/services/wsmessages.service';
import { EMPTY, Observable, Subscription } from 'rxjs';

/**
 * Affichage des événements spécifiques à un périphérique
 */
@Component({
  selector: 'app-wsevents',
  templateUrl: './wsevents.component.html',
  styleUrls: ['./wsevents.component.css'],
})
export class WseventsComponent implements OnInit, OnDestroy {
  public deviceId = '';
  public readerId = '';
  public readerName = '';
  blockTitleLabel = $localize`Realtime events for `;
  public displayedColumns = ['timestamp', 'event', 'params'];
  public dataSource: Observable<any[]>;
  public device$: Observable<IDeviceResponse>;
  private currentDevice: IDeviceResponse;
  public isWsRunning = false;
  private hasWebsocketEvents = false;
  private topButtons = Array<ITopButton>();
  private buttonsClickSubscriber: Subscription;

  constructor(
    private currentTitleService: CurrentTitleService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private wsmessagesService: WsmessagesService,
    private router: Router,
    private dialogsService: DialogsService,
    private topButtonsService: TopButtonsService,
    private app: ApplicationService,
  ) {}

  ngOnInit() {
    this.currentTitleService.changeTitle($localize`Websocket events`);
    this.setTopButtons();
    this.deviceId =
      this.activatedRoute.snapshot.paramMap.get('deviceId') != null
        ? (this.activatedRoute.snapshot.paramMap.get('deviceId') as string)
        : '';
    this.readerId =
      this.activatedRoute.snapshot.paramMap.get('readerId') != null
        ? (this.activatedRoute.snapshot.paramMap.get('readerId') as string)
        : '';

    // Set buttons in the top of the screen
    this.topButtonsService.setTopButtons(this.topButtons);
    this.manageTopButtonsClicks();
    this.getDeviceEvents();
  }

  ngOnDestroy() {
    this.wsmessagesService.stopListening();
    this.buttonsClickSubscriber.unsubscribe();
    this.topButtonsService.removeTopButtons();
  }

  manageTopButtonsClicks() {
    // And subscribe to their clicks
    this.buttonsClickSubscriber = this.topButtonsService.buttonsClicks.subscribe((buttonParameters: IButtonClick) => {
      switch (buttonParameters.id) {
        case 'back':
          this.goBack();
          break;

        case 'pauseButton':
          this.changeWsState();
          const newLabel = this.isWsRunning ? $localize`Pause` : $localize`Unpause`;
          this.topButtons = this.topButtonsService.changeButtonLabel(this.topButtons, 'pauseButton', newLabel);
          this.topButtonsService.setTopButtons(this.topButtons);
          break;
      }
    });
  }

  setTopButtons() {
    this.topButtons = [
      {
        label: $localize`Home`,
        color: 'warn',
        icon: 'keyboard_arrow_left',
        type: 'raised-icon-with-text',
        id: 'back',
      },
      {
        label: $localize`Pause`,
        color: 'warm',
        type: 'raised-button',
        id: 'pauseButton',
      },
    ];
  }

  getDeviceFromComponent(device: Device) {
    this.currentDevice = device;
    // Mise en place du nom du lecteur dans le template, si on le trouve
    let index = -1;
    // @ts-ignore
    if (this.currentDevice.Pcsc && this.currentDevice.Pcsc['ReaderIds']) {
      // @ts-ignore
      for (const readerId of this.currentDevice.Pcsc['ReaderIds']) {
        index++;
        if (readerId.trim().toLowerCase() === this.readerId.trim().toLocaleLowerCase()) {
          break;
        }
      }
      if (index !== -1) {
        // @ts-ignore
        this.readerName = this.currentDevice.Pcsc['Names'][index];
      }
    }
  }

  deviceLoadFailed() {
    this.goBack();
  }

  getDeviceEvents() {
    if (!this.hasWebsocketEvents) {
      // In case we need to reload, no need to reload this part if it is ok
      this.dataSource = EMPTY;
      this.dataSource = this.wsmessagesService.filterMessagesForDevice(this.deviceId, [], this.readerId);
      this.dataSource.subscribe(
        () => {
          this.hasWebsocketEvents = true;
        },
        () => {
          this.hasWebsocketEvents = false;
          const title = $localize`Error`;
          const message = $localize`There was an error while talking to the Websocket`;
          this.dataSource = EMPTY;
          this.wsmessagesService.stopListening();
          this.dialogsService.retryQuit(title, message).subscribe({
            next: (button) => {
              if (button === 'retry') {
                return this.getDeviceEvents();
              } else {
                this.app.appQuitOrCancel();
              }
            },
          });
          return;
        },
        () => {
          // complete
          /*this.hasWebsocketEvents = false;
          const snackBarRef = this.snackBar.open('The websocket closed gracefully', 'Websocket', {
            duration: 4000,
          });*/
          return;
        },
      );
      this.isWsRunning = true;
    }
  }

  goBack(): void {
    this.isWsRunning = false;
    this.router.navigate(['/']);
  }

  openEventDetails(eventTitle: string, eventData: string, eventTimestamp: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;

    dialogConfig.data = {
      dataEvent: eventData,
      dataEventTitle: eventTitle,
      dataWhen: eventTimestamp,
      dataTitle: $localize`Event details`,
      dataDeviceName: this.currentDevice.Name,
      dataDeviceSerialNumer: this.currentDevice.SerialNumber,
    };
    this.dialog.open(DialogEventDataDialog, dialogConfig);
  }

  /**
   * Pause or restart events from WS
   */
  changeWsState() {
    this.isWsRunning = !this.isWsRunning;
    if (!this.isWsRunning) {
      this.wsmessagesService.pause();
    } else {
      this.wsmessagesService.unpause();
    }
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: './event-data-dialog.html',
})
export class DialogEventDataDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
