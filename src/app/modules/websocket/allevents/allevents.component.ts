import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IButtonClick } from '@shared/models/UI/ibuttonclick.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { WsmessagesService } from '@shared/services/wsmessages.service';
import { Observable, Subscription } from 'rxjs';

/**
 * Display all the events from the WS (without any filter on device or peripheral)
 */
@Component({
  selector: 'app-allevents',
  templateUrl: './allevents.component.html',
  styleUrls: ['./allevents.component.scss'],
})
export class AlleventsComponent implements OnInit, OnDestroy {
  public displayedColumns = ['timestamp', 'event', 'params'];
  public dataSource: Observable<any[]>;
  public isWsRunning = false;
  private topButtons = Array<ITopButton>();
  private buttonsClickSubscriber: Subscription;

  constructor(
    private currentTitleService: CurrentTitleService,
    private dialog: MatDialog,
    private wsmessagesService: WsmessagesService,
    private dialogsService: DialogsService,
    private router: Router,
    private topButtonsService: TopButtonsService,
    private app: ApplicationService,
  ) {}

  ngOnInit() {
    this.currentTitleService.changeTitle($localize`Realtime events (all)`);
    this.setTopButtons();
    this.getAllWebsocketEvents();

    // Set buttons in the top of the screen
    this.topButtonsService.setTopButtons(this.topButtons);

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

  private getAllWebsocketEvents() {
    this.dataSource = new Observable<any[]>();
    this.dataSource = this.wsmessagesService.getAllMessages();
    this.dataSource.subscribe(
      () => {},
      () => {
        const title = $localize`Error`;
        const message = $localize`There was an error with the websocket`;
        this.dataSource = new Observable<any[]>();
        this.wsmessagesService.stopListening();
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              return this.getAllWebsocketEvents();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
        return;
      },
      () => {
        return;
      },
    );
    this.isWsRunning = true;
  }

  ngOnDestroy() {
    this.wsmessagesService.stopListening();
    this.buttonsClickSubscriber.unsubscribe();
    this.topButtonsService.removeTopButtons();
  }

  goBack(): void {
    this.isWsRunning = false;
    this.router.navigate(['/']);
  }

  /**
   * Shows the details of an event
   */
  openDetails(eventTitle: string, eventData: string, eventTimestamp: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;

    dialogConfig.data = {
      dataEvent: eventData,
      dataEventTitle: eventTitle,
      dataWhen: eventTimestamp,
      dataTitle: $localize`Event details`,
    };
    this.dialog.open(DialogAllEventsEventDataDialog, dialogConfig);
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
  selector: 'dialog-data-dialog',
  templateUrl: './event-data-dialog.html',
})
export class DialogAllEventsEventDataDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
