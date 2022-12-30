import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Device } from '@shared/classes/Device';
import { DevicesList } from '@shared/configurations/devicesList';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { DetectionService } from 'app/modules/detection/detection.service';

/**
 * Composant en charge d'afficher des informations sur un vrai périphérique qui
 * est connecté au PC de l'utilisateur et que celui-ci à choisit ou sur un type
 * de périphérique qui n'est pas forcément connecté au PC (cas de la création
 * d'une configuration).
 * Le composant permet aussi d'afficher des boutons sur la droite de son template.
 */
@Component({
  selector: 'app-device-informations',
  templateUrl: './device-informations.component.html',
  styleUrls: ['./device-informations.component.css'],
})
export class DeviceInformationsComponent implements OnInit {
  devicesList: IDeviceList[] = DevicesList;
  currentDevice: Device;
  isLoadingDevice = false;
  readerName = '';
  advanced: boolean = false;

  @Input() deviceId = ''; // ID du device en provenance du service
  @Input() readerId = ''; // ID du slot
  @Input() componentName = ''; // Nom du composant de périphérique
  @Input() blockTitle = 'Configure'; // Titre du bloc
  @Input() icon = 'settings'; // Icône à utiliser
  @Input() withFirmwareInformation = false; // Est-ce qu'il faut afficher les informations de firmware ?
  @Input() configurationName = ''; // Le nom de la configuration
  @Input() configurationIsInReadOnlyMode = false;
  @Input() configurationButtonId = 'configurationEdit'; //  L'ID à lancer (via l'observer) pour avertir qu'on a cliqué sur ce bouton
  @Input() buttonsList: ITopButton[] = []; // Liste des boutons à mettre en place sur la droite  @todo, mettre en place un onChange ?

  @Output() readonly deviceLoaded = new EventEmitter<Device>(); // Pour indiquer le chargement avec succès d'un périphérique
  @Output() readonly loadingDeviceFailed = new EventEmitter(); // Pour indiquer une erreur lors du chargement d'un périphérique

  constructor(
    private snackBar: MatSnackBar,
    private detectService: DetectionService,
    private dialogsService: DialogsService,
    private deviceInformationsButtonsService: DeviceInformationsButtonsService,
    public app: ApplicationService,
  ) { }

  ngOnInit(): void {
    if (this.deviceId && this.deviceId.trim() !== '0') {
      this.deviceId = this.deviceId.trim();
    }
    if (this.componentName && this.componentName.trim() !== '') {
      this.componentName = this.componentName;
    }
    if (this.deviceId !== '' && this.deviceId !== '0') {
      // On a spécifié un deviceId
      this.loadDevice();
    } else if (this.componentName !== '') {
      // On a spécifié un nom de composant
      this.createFakeDeviceFromComponent();
    } else {
      throw new Error('In DeviceInformationsComponent() we are not loading anything !!!');
    }
    this.advanced = localStorage.getItem('sc_advanced_mode') === "true" ? true : false;
  }

  // Chargement, via le service, des informations d'un vrai périphérique qui est censé être atteignable par ce PC.
  loadDevice() {
    this.isLoadingDevice = true;
    this.detectService.getDevice(this.deviceId).subscribe({
      next: (device: IDeviceResponse) => {
        this.currentDevice = new Device(device);
        this.readerName = '';
        if (this.readerId.trim() !== '') {
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
        this.isLoadingDevice = false;
        this.deviceLoaded.emit(this.currentDevice);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoadingDevice = false;
        console.error('Error while loading a device', this.deviceId);
        console.error(error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while loading your device:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.loadDevice();
            } else {
              this.loadingDeviceFailed.emit();
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    });
  }

  // On va "forger" un objet device pour afficher des informations sur le périphérique en cours de configuration
  createFakeDeviceFromComponent() {
    for (const deviceList of this.devicesList) {
      if (this.componentName === deviceList.component) {
        const fakeDevice: IDeviceResponse = {
          DeviceId: '',
          Name: deviceList.title,
          FriendlyName: deviceList.title,
          Channel: '',
          Profile: '',
          Status: '',
          PnpId: '',
          Mode: '',
          VendorId: 0,
          ProductId: 0,
          Version: '',
          Firmware: deviceList.firmware,
          UniqueId: '',
        };
        this.currentDevice = new Device(fakeDevice);
        return;
      }
    }
    console.error('In createFakeDeviceFromComponent() we were not able to find the fake device to create');
  }

  // Gère les clics sur les boutons présents en haut de page
  deviceInformationButtonClick(buttonLabel: string, buttonId?: string) {
    buttonId = buttonId || buttonLabel;
    this.deviceInformationsButtonsService.emitData(buttonId);
  }

  setAdvancedState($event: MatSlideToggleChange) {
    //set advanced state on user's profile
    this.advanced = $event.checked;
    this.deviceInformationsButtonsService.saveAdvancedState(this.advanced);
    localStorage.setItem('sc_advanced_mode', $event.checked.toString());
    if ($event.checked)
      this.snackBar.open("Advanced mode: ON", $localize`Success`, {
        duration: 3000,
        panelClass: "snackbar-information",
      });
    else this.snackBar.open("Advanced mode: OFF", $localize`Success`, {
      duration: 3000,
      panelClass: "snackbar-information",
    });
  }
}
