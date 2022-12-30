declare var require: any;
import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '@shared/services/application.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { ServiceService } from '@shared/services/service.service';
import { UtilitiesProvider } from '@shared/services/utilities.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Display information about the service
 */
@Component({
  selector: 'app-servicedata',
  templateUrl: './servicedata.component.html',
  styleUrls: ['./servicedata.component.css'],
})
export class ServiceDataComponent implements OnInit {
  public dataSourceGeneral: Observable<any>;
  public dataSourceSettings: Observable<any>;
  public dataSourceSystem: Observable<any>;
  public dataSourceVersions: Observable<any>;
  public displayedColumns = ['key', 'value'];
  public appVersion: string = require('../../../../../package.json').version;

  constructor(
    private currentTitleService: CurrentTitleService,
    private serviceInformation: ServiceService,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private utilities: UtilitiesProvider,
  ) {
    this.currentTitleService.changeTitle($localize`ServiceData`);
    this.getServiceInformation();
    this.getServiceSettings();
    this.getSystemInformation();
    this.getServiceVersions();
  }

  ngOnInit() {}

  getServiceInformation() {
    this.dataSourceGeneral = this.serviceInformation.getServiceInformation().pipe(
      map((data) => {
        let values = this.utilities.fromUnstructedJsonToStructuredJson(data);
        values.push({
          key: 'Application SpringCard Companion',
          value: this.appVersion,
        });
        return values;
      }),
      catchError((error) => {
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for service information` + '\n\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getServiceInformation();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
        return EMPTY;
      }),
    );
  }

  getSystemInformation() {
    this.dataSourceSystem = this.serviceInformation.getSystemInformation().pipe(
      map((data) => {
        let values = this.utilities.fromUnstructedJsonToStructuredJson(data);
        return values;
      }),
      catchError((error) => {
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for service information` + '\n\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getSystemInformation();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
        return EMPTY;
      }),
    );
  }

  getServiceVersions() {
    this.dataSourceVersions = this.serviceInformation.getServiceVersions().pipe(
      map((data) => {
        let values = this.utilities.fromUnstructedJsonToStructuredJson(data);
        return values;
      }),
      catchError((error) => {
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for service information` + '\n\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getServiceVersions();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
        return EMPTY;
      }),
    );
  }

  getServiceSettings() {
    this.dataSourceSettings = this.serviceInformation.getServiceSettings().pipe(
      map((data) => {
        let values = this.utilities.fromUnstructedJsonToStructuredJson(data);
        return values;
      }),
      catchError((error) => {
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for service information` + '\n\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getServiceSettings();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
        return EMPTY;
      }),
    );
  }
}
