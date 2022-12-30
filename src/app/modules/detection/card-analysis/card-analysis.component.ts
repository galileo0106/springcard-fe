import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@shared/classes/Device';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
declare const CardAnalysis: any;

@Component({
  selector: 'app-card-analysis',
  templateUrl: './card-analysis.component.html',
  styleUrls: ['./card-analysis.component.css'],
})
export class CardAnalysisComponent implements OnInit {
  headerTitle = $localize`Card analysis on `;
  headerIcon = 'credit_card';
  readerId = '';
  deviceId = '';
  componentName = 'CardAnalysisComponent';
  isAnalysing = false;
  hasError = false;
  errorMessage = '';
  resultMessage = '';
  isSuccess = false;
  readerName = '';
  public currentDevice: IDeviceResponse;
  pageTitle = $localize`Card(s) analysis`;

  constructor(
    private currentTitleService: CurrentTitleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialogsService: DialogsService,
  ) {}

  ngOnInit(): void {
    this.currentTitleService.changeTitle(this.pageTitle);

    // prettier-ignore
    this.deviceId = this.activatedRoute.snapshot.paramMap.get('deviceId') != null ? (this.activatedRoute.snapshot.paramMap.get('deviceId') as string) : '';
    if (this.deviceId === '') {
      this.dialogsService.showOkMessage($localize`Error`, `the DeviceId is missing`).subscribe({
        next: () => {
          return;
        },
      });
      this.goBack();
    }

    // prettier-ignore
    this.readerId = this.activatedRoute.snapshot.paramMap.get('readerId') != null ? (this.activatedRoute.snapshot.paramMap.get('readerId') as string) : '';
    if (this.readerId === '') {
      this.dialogsService.showOkMessage($localize`Error`, `the ReaderId is missing`).subscribe({
        next: () => {
          return;
        },
      });
      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onProgress() {
    //console.info("onProgress");
  }

  onVerbose(message: string) {
    console.info(message);
  }

  onResult(messages: string[]) {
    this.isAnalysing = false;
    this.isSuccess = true;
    if (messages.length) {
      this.resultMessage = '';
      for (const message of messages) {
        console.info(message);
        this.resultMessage += message + '<br>';
      }
    } else {
      this.resultMessage = $localize`Card not recognized!` + '<br>';
    }
  }

  onError(message: string) {
    this.isAnalysing = false;
    this.hasError = true;
    this.resultMessage = '';
    this.errorMessage = message;
    console.error(message);
  }

  // Lance l'analyse de la carte
  cardAnalysis() {
    this.isAnalysing = true;
    this.isSuccess = false;
    this.hasError = false;
    this.errorMessage = '';
    this.resultMessage = '';
    CardAnalysis.setDebugMode(false);
    CardAnalysis.setReaderId(this.readerId);
    CardAnalysis.setHandlers(this.onProgress.bind(this), this.onVerbose.bind(this), this.onResult.bind(this), this.onError.bind(this));
    CardAnalysis.Run();
  }

  /**
   * Permet de récupérer un objet Device depuis DeviceInformationsComponent
   * qui est en charge de récupérer les périphériques passés dans les routes.
   * Cette méthode est appelée par ce composant via la création d'un évènement.
   */
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

  /**
   * Méthode appelée par DeviceInformationsComponent (en charge de récupérer
   * les devices passés dans les routes), lorsque le téléchargement du
   * périphérique à échoué.
   */
  deviceLoadFailed() {
    this.goBack();
  }
}
