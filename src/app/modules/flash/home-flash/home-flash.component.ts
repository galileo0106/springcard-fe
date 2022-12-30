import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { doWeUseWebsocket, getFieldValue } from '@shared/appSettings';
import { Device } from '@shared/classes/Device';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { IFirmwareDownload } from '@shared/models/Firmwares/firmware.download.model';
import { ILoadFirmwareProgress } from '@shared/models/Firmwares/firmware.progress';
import { IFirmwareToDownload } from '@shared/models/Firmwares/firmwares.list.model';
import { IButtonClick } from '@shared/models/UI/ibuttonclick.model';
import { IFirmwareInfo } from '@shared/models/Firmwares/ifirmware.info.model';
import { IFirmwareUsed } from '@shared/models/Firmwares/ifirmwareUsed.model';
import { IGetProductFirmwaresList } from '@shared/models/Firmwares/igetproductfirmwareslist.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FirmwaresService } from '@shared/services/firmwares.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { WsmessagesService } from '@shared/services/wsmessages.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { getUserInformation } from '@shared/appSettings';
import { ICanDoSomethingJsonResponse } from '@shared/models/icandosomethingjsonresponse.model';
import { INewHistory } from '@shared/models/User/inewhistory.model';

/**
 * Flash le firmware d'un périphérique
 */
@Component({
  selector: 'app-home-flash',
  templateUrl: './home-flash.component.html',
  styleUrls: ['./home-flash.component.scss'],
})
export class HomeFlashComponent implements OnInit, OnDestroy {
  deviceId = '';
  progressStatus = '';
  step = 1;
  type = 1;
  isDownloading = false;
  isValidatingFirmware = false;
  public flashProgressPercentage = 0;
  canGoBackWhileFlashing = false;
  canFinish = false;
  fileToUpload: File;
  private topButtons = Array<ITopButton>();
  private buttonsClickSubscriber: Subscription;
  private currentDevice: IDeviceResponse;
  public firmwaresList: IFirmwareToDownload[] = [];
  filenameToUpload = '';
  blockTitleLabel = $localize`Change firmware of `;
  localFileContent: string | ArrayBuffer | null = '';
  locaFileContentLoadedWithSuccess = false;
  isDownloadingLocalFile = false;
  isDownloadingFirmwareList = false;
  isDownloadingDistantFirmware = false;
  overLimit = false;
  limitLabel = $localize`products you can flash`;
  firmwareSelectForm = new UntypedFormGroup({
    selectedSource: new UntypedFormControl(),
    selectedFirmware: new UntypedFormControl(),
    file: new UntypedFormControl(),
  });
  private firmwareUsed: IFirmwareUsed = {
    UniqueId: '',
  };

  constructor(
    private currentTitleService: CurrentTitleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogsService: DialogsService,
    private topButtonsService: TopButtonsService,
    private app: ApplicationService,
    private firmwaresService: FirmwaresService,
    private wsmessagesService: WsmessagesService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.currentTitleService.changeTitle($localize`Flash device`);
    this.canStillFlash();
    this.getRouteParameters();
    this.setTopButtons();
  }

  ngOnDestroy() {
    if (this.wsmessagesService) {
      this.wsmessagesService.stopListening();
    }
    if (this.buttonsClickSubscriber) {
      this.buttonsClickSubscriber.unsubscribe();
    }
    this.topButtonsService.removeTopButtons();
  }

  // Est-ce que l'utilisateur peut toujours flasher des produits ?
  canStillFlash() {
    this.overLimit = false;
    if (this.authService.getType() === 2) {
      // Les comptes team peuvent tout faire
      return;
    }
    this.authService.canFlashProducts().subscribe(
      (response: ICanDoSomethingJsonResponse) => {
        if (response.Result === false) {
          this.overLimit = true;
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      },
    );
  }

  getRouteParameters() {
    // prettier-ignore
    this.deviceId = this.activatedRoute.snapshot.paramMap.get('deviceId') != null ? (this.activatedRoute.snapshot.paramMap.get('deviceId') as string) : '';
    if (this.deviceId === '') {
      this.dialogsService.showOkMessage($localize`Error`, `Error, can't read the DeviceId from parameters`).subscribe({
        next: () => {
          return;
        },
      });
      this.goBack();
    }
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
    ];

    this.topButtonsService.setTopButtons(this.topButtons);
    this.buttonsClickSubscriber = this.topButtonsService.buttonsClicks.subscribe((buttonParameters: IButtonClick) => {
      switch (buttonParameters.id) {
        case 'back':
          this.goBack();
          break;
      }
    });
  }

  // Charge le contenu d'un fichier local pour flasher le lecteur
  readLocalFile(files: FileList | null) {
    this.locaFileContentLoadedWithSuccess = false;
    this.isDownloadingLocalFile = true;
    if (files && files.length >= 0) {
      const reader = new FileReader();
      const file = files[0];
      this.filenameToUpload = file.name;
      reader.addEventListener(
        'load',
        () => {
          this.localFileContent = reader.result;
          this.locaFileContentLoadedWithSuccess = true;
          this.isDownloadingLocalFile = false;
        },
        false,
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      this.isDownloadingLocalFile = false;
    }
  }

  // Méthode appelée par le composant DeviceInformationsComponent lorsque le téléchargement du périphérique fonctionne
  getDeviceFromComponent(device: Device) {
    this.currentDevice = device;
    this.getFirmwaresList(this.currentDevice); // On enchaîne sur la liste des firmwares disponibles depuis le back office
  }

  // Méthode appelée par le composant DeviceInformationsComponent lorsque le téléchargement du périphérique échoue
  deviceLoadFailed() {
    this.dialogsService.showOkMessage($localize`Error`, `It was not possible to find the device you selected`).subscribe({
      next: () => {},
    });
    this.goBack();
  }

  // Retourne la liste des firmwares qui correspondent au périphérique choisi
  getFirmwaresList(device: IDeviceResponse) {
    this.isDownloadingFirmwareList = true;
    const product: IGetProductFirmwaresList = {
      Firmware: device.Firmware,
      Hardware: device.Hardware,
      Name: device.Name,
    };

    this.firmwaresService
      .getFirmwaresList(product)
      .pipe(finalize(() => (this.isDownloadingFirmwareList = false)))
      .subscribe({
        next: (firmwares: IFirmwareToDownload[]) => {
          this.firmwaresList = firmwares;
          if (firmwares && firmwares.length === 0) {
            this.dialogsService
              .showOkMessage($localize`Error`, $localize`It's not possible to find any firmware for this product`)
              .subscribe({
                next: () => {
                  return;
                },
              });
            return;
          }
          this.step = 1;
        },
        error: (error: HttpErrorResponse) => {
          const title = $localize`Error during a network request`;
          const message = $localize`There was an error while getting the list of firmwares` + '\n\n' + error.message;
          this.dialogsService.retryQuit(title, message).subscribe({
            next: (button) => {
              if (button === 'retry') {
                this.getFirmwaresList(this.currentDevice);
              } else {
                this.app.appQuitOrCancel();
              }
            },
          });
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  selectedSource(): string {
    return getFieldValue(this.firmwareSelectForm, 'selectedSource');
  }

  // Est-ce que le fichier local de firmware choisit par l'utilisateur est valide ?
  isLocalFirmwareFileValid(firmwareInformation: IFirmwareInfo): boolean {
    if (this.currentDevice.Firmware) {
      if (this.currentDevice.Firmware.trim().toLowerCase() !== firmwareInformation.Firmware.trim().toLowerCase()) {
        return false;
      }
    } else if (this.currentDevice.ProductName) {
      if (this.currentDevice.ProductName.trim().toLowerCase() !== firmwareInformation.Product.trim().toLowerCase()) {
        return false;
      }
    }
    return true;
  }

  // Appelé après validation de l'utilisateur du firmware à utiliser (local ou distant)
  selectFirmwareSubmit() {
    const selectedSource = getFieldValue(this.firmwareSelectForm, 'selectedSource') as string;
    if (selectedSource === null || selectedSource.trim() === '') {
      return;
    }
    this.firmwareUsed.Firmware = this.currentDevice.Firmware;
    this.firmwareUsed.Hardware = this.currentDevice.Hardware;
    this.firmwareUsed.Name = this.currentDevice.Name;

    switch (selectedSource) {
      // Dernière version en ligne
      case 'lastOnline':
        this.step = 2;
        this.firmwareUsed.firmware_meta_id = this.firmwaresList[0].id;
        const newHistoryModel: INewHistory = {
          action: 'Flashed with ' + this.firmwareUsed.Firmware + ' ' + this.firmwareUsed.Version,
          device_name: this.currentDevice.FriendlyName,
          serial_number: this.currentDevice.SerialNumber,
        };
        this.authService.setHistory(newHistoryModel).subscribe();
        this.downloadOnlineFirmware(0);
        break;

      // Fichier distant, il faut d'abord le télécharger avant de le passer au service
      case 'previousVersion':
        const selectedFirmwareToDownload = this.firmwareSelectForm.get('selectedFirmware');
        if (!selectedFirmwareToDownload) {
          return;
        }
        this.step = 2;
        this.firmwareUsed.firmware_meta_id = this.firmwaresList[selectedFirmwareToDownload.value].id;
        this.authService.setHistory({action: 'Flashed with ' + this.firmwareUsed.Firmware + ' ' + this.firmwareUsed.Version, device_name: this.firmwareUsed.Name, serial_number: this.firmwareUsed.UniqueId});
        this.downloadOnlineFirmware(selectedFirmwareToDownload.value);
        break;

      // Fichier local, on le valide et s'il est bon, on peut directement le passer au service
      case 'localFile':
        if (this.localFileContent && this.locaFileContentLoadedWithSuccess) {
          this.isValidatingFirmware = true;
          this.firmwaresService.validateLocalFirmwareFile(this.localFileContent as string).subscribe({
            next: (firmwareInformation: IFirmwareInfo) => {
              this.isValidatingFirmware = false;
              if (!this.isLocalFirmwareFileValid(firmwareInformation)) {
                this.dialogsService
                  .yesNo(
                    $localize`Warning`,
                    $localize`This firmware DOES NOT match the selected hardware. Loading this firmware into this device is likely to brick the device and void its warranty. Are you really sure you want to this?`,
                  )
                  .subscribe((saveDataResponse: boolean) => {
                    if (saveDataResponse === false) {
                      return;
                    } else {
                      this.step = 2;
                      this.type = 2;
                      // this.authService.setHistory({action: 'Flahsed with local file', device_name: firmwareInformation.Firmware, serial_number: firmwareInformation.Version});
                      this.loadFirmware(true, this.localFileContent as string);
                    }
                  });
              } else {
                this.firmwareUsed.service_BuildDate = firmwareInformation.BuildDate;
                this.firmwareUsed.service_Firmware = firmwareInformation.Firmware;
                this.firmwareUsed.service_Product = firmwareInformation.Product;
                this.firmwareUsed.service_Revision = firmwareInformation.Revision;
                this.firmwareUsed.service_Vendor = firmwareInformation.Vendor;
                this.firmwareUsed.service_Version = firmwareInformation.Version;
                this.step = 2;
                this.loadFirmware(true, this.localFileContent as string);
              }
            },
            error: (error: HttpErrorResponse) => {
              this.isValidatingFirmware = false;
              if (error.status === 422) {
                this.dialogsService
                  .showOkMessage($localize`Error`, $localize`The file you have chosen is not correct, please select another one.`)
                  .subscribe({
                    next: () => {
                      return;
                    },
                  });
                return;
              }
              console.error('Error while validating a local file to be used as a firmware');
              const title = $localize`Error during a network request`;
              const message = $localize`There was an error while validating your local file` + '\n\n' + error.message;
              this.dialogsService.retryQuit(title, message).subscribe({
                next: (button) => {
                  if (button === 'retry') {
                    this.selectFirmwareSubmit();
                  } else {
                    this.app.appQuitOrCancel();
                  }
                },
              });
            },
          });
        } else {
          this.snackBar.open($localize`Please select a file.`, $localize`Error`, {
            duration: 5000,
          });
        }
        break;
    }

    //this.step = 2;
    // Fichier distant, il faut d'abord le télécharger avant de le passer au service
    /*const selectedFirmware = this.firmwareSelectForm.get('selectedFirmware');
    if (!selectedFirmware) {
      return;
    }
    this.downloadOnlineFirmware(selectedFirmware.value);*/
  }

  // Préparation au téléchargement du firwmare situé sur le back office
  private downloadOnlineFirmware(selectedFirmwareIndex: number) {
    const firmwareToDownload: IFirmwareDownload = {
      Filename: this.firmwaresList[selectedFirmwareIndex].Filename,
      Version: this.firmwaresList[selectedFirmwareIndex].Version,
      Email: this.authService.getEmailFromSession(),
      IsPublic: this.firmwaresList[selectedFirmwareIndex].IsPublic,
    };
    this.downloadFirmwareFromServer(firmwareToDownload);
  }

  // Télécharge le firmware depuis le back office et l'envoi au service
  private downloadFirmwareFromServer(firmwareToDownload: IFirmwareDownload) {
    this.isDownloadingDistantFirmware = true;
    this.firmwaresService.downloadFirmware(firmwareToDownload).subscribe({
      next: (response: string) => {
        this.loadFirmware(true, response);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        let errorMessage = $localize`There was an error while downloading the requested firwmare`;
        if (error.status === 422) {
          errorMessage += ' ' + error.error.Message;
        }
        this.dialogsService.retryQuit('Error', errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.downloadFirmwareFromServer(firmwareToDownload);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
      complete: () => (this.isDownloadingDistantFirmware = false),
    });
  }

  // Surveille la websocket pour voir les événements de flash
  private getLiveProgressionThruWS() {
    if (!doWeUseWebsocket()) {
      console.info('Socket not used');
      return;
    }
    this.flashProgressPercentage = 0;
    this.isDownloadingDistantFirmware = false;
    console.info('Starting websocket');
    this.wsmessagesService.filterMessagesForDevice(this.deviceId, ['Device.LoadFirmwareProgress']).subscribe(
      (messages) => {
        if (messages.length > 0) {
          const progress = messages[0]['params'] as ILoadFirmwareProgress;
          this.flashProgressPercentage = progress.Progress;
          this.progressStatus = progress.Status;
          if (this.flashProgressPercentage === 100) {
            this.wsmessagesService.stopListening();
          }
          switch (this.progressStatus.trim().toLowerCase()) {
            case 'pending':
              break;

            case 'failed':
              this.canGoBackWhileFlashing = true;
              this.flashProgressPercentage = 0;
              this.progressStatus = $localize`The procedure has failed. The device is restarting in fail-safe mode.`;
              break;

            case 'cancelled':
              this.canGoBackWhileFlashing = true;
              this.flashProgressPercentage = 0;
              this.progressStatus = $localize`The procedure has been cancelled. The device is restarting.`;
              break;

            case 'success':
              this.flashProgressPercentage = 0;
              this.progressStatus = this.progressStatus = $localize`The procedure has terminated successfully. The device is restarting.`;
              this.canFinish = true;
              break;

            case 'success (already up to date)':
              this.flashProgressPercentage = 0;
              this.progressStatus =
                this.progressStatus = $localize`The procedure has terminated successfully. The device was already up to date.`;
              this.canFinish = true;
              break;

            default:
              this.flashProgressPercentage = 0;
              this.progressStatus = $localize`Unkown status: ` + this.progressStatus;
              this.canFinish = true;
              break;
          }
        }
      },
      (error) => {
        this.canGoBackWhileFlashing = true;
        console.error(error);
        this.snackBar.open($localize`There was an error with the websocket`, $localize`Error`, {
          duration: 5000,
        });
      },
      () => {
        // complete
      },
    );
  }

  // Envoi au back office des informations sur le firmware utilisé ainsi que le résultat du flash
  // On ne gère pas le succès ou l'échec
  sendFirmwareUsedData() {
    const userInfo = getUserInformation();
    const tempDevice = new Device(this.currentDevice);
    this.firmwareUsed.UniqueId = this.currentDevice.UniqueId;
    this.firmwareUsed.Version = this.currentDevice.Version;
    this.firmwareUsed.NumericalVersion = tempDevice.getNumericalVersion();
    this.firmwareUsed.Location = this.currentDevice.Location;
    this.firmwareUsed.Inventory = this.currentDevice.Inventory;
    this.firmwareUsed.Profile = this.currentDevice.Profile;
    this.firmwareUsed.Mode = this.currentDevice.Mode;
    this.firmwareUsed.MachineName = userInfo.MachineName;
    this.firmwareUsed.ComputerName = userInfo.ComputerName;
    this.firmwareUsed.UserName = userInfo.UserName;
    this.firmwaresService.firmwareUsed(this.firmwareUsed).subscribe();
  }

  // Flash du lecteur
  loadFirmware(openWebsocket: boolean, firmwareBlob: string) {
    this.canGoBackWhileFlashing = false;
    this.canFinish = false;
    if (openWebsocket) {
      this.getLiveProgressionThruWS();
    }
    // Demande au service de flasher le lecteur
    this.firmwaresService.loadFirmware(this.deviceId, firmwareBlob).subscribe(
      (response) => {
        let message = '';
        let title = '';
        this.canFinish = true;
        this.firmwareUsed.success = true;
        this.firmwareUsed.reason = response.Result ? response.Result : '';
        if (response.Result === 'success') {
          this.progressStatus = message = $localize`Firmware sent to the product with success`;
        } else if (response.Result === 'success (already up to date)') {
          this.progressStatus = message = $localize`The firmware was alreay up to date`;
          title = $localize`Success`;
        } else {
          this.progressStatus = message = $localize`Failed to send the firmware to the reader`;
          title = $localize`Fail`;
        }
        this.sendFirmwareUsedData();
        this.snackBar.open(message, title, {
          duration: 6000,
        });
      },
      (error: HttpErrorResponse) => {
        this.firmwareUsed.success = true;
        this.firmwareUsed.reason = error.error.Message ? error.error.Message : error.message;
        let errorMessage = $localize`There was an error while sending the firwmare to the product : `;
        if (error.status === 422) {
          errorMessage += ' ' + error.error.Message;
        }
        this.sendFirmwareUsedData();
        this.dialogsService.retryQuit('Error', errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.loadFirmware(false, firmwareBlob);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }
}
