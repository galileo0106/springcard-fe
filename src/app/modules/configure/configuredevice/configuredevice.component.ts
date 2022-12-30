import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { Device } from '@shared/classes/Device';
import { IConfigurationSummary } from '@shared/models/Configuration/configuration.summary.model';
import { IDeviceConfigurationRequest } from '@shared/models/Configuration/device.configuration.model';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { ApplicationService } from '@shared/services/application.service';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';
import { Observable } from 'rxjs';
import { ProductConfiguration } from '@shared/classes/ProductConfiguration';
import { Project } from '@shared/classes/Project';
import { AuthService } from '@shared/services/AuthService';
import { ICanDoSomethingJsonResponse } from '@shared/models/icandosomethingjsonresponse.model';

/**
 * Ecran intermédiaire servant à choisir si on veut charger une configuration existante pour un périphérique donné ou en créer une nouvelle, à partir du type de périphérique sélectionné
 * route associée: /configuredevice
 * Dans la route on est censés recevoir le deviceId
 */
@Component({
  selector: 'app-configuredevice',
  templateUrl: './configuredevice.component.html',
  styleUrls: ['./configuredevice.component.css'],
})
export class ConfiguredeviceComponent implements OnInit {
  configurationsLoaded = false;
  deviceId = '';
  device$: Observable<IDeviceResponse>;
  private currentDevice: Device;
  private configurationId = 0;
  private productConfiguration: ProductConfiguration;
  configurationForm: UntypedFormGroup;
  overLimit = false;
  limitLabel = $localize`configurations that you can create`;

  actionForm = new UntypedFormGroup({
    selectedConfiguration: new UntypedFormControl('', [Validators.required]),
  });
  configurations$: IConfigurationSummary[] = [];

  constructor(
    private currentTitleService: CurrentTitleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private configurationsService: ConfigurationsService,
    private valdemortConfig: ValdemortConfig,
    private fb: UntypedFormBuilder,
    private authService: AuthService,
  ) {
    this.currentTitleService.changeTitle($localize`Configure device`);
    this.valdemortConfig.displayMode = DisplayMode.ONE;
    this.valdemortConfig.shouldDisplayErrors = () => true;
  }

  ngOnInit(): void {
    // prettier-ignore
    this.deviceId = this.activatedRoute.snapshot.paramMap.get('deviceId') != null ? (this.activatedRoute.snapshot.paramMap.get('deviceId') as string) : '';
    if (this.deviceId === '') {
      this.dialogsService.showOkMessage($localize`Error`, `Error, can't read the DeviceId`).subscribe({
        next: () => {
          this.goBack();
          return;
        },
      });
      this.goBack();
      return;
    }
    this.productConfiguration = new ProductConfiguration(this.configurationsService);
    this.productConfiguration.formBuilder = this.fb;
    this.configurationForm = this.productConfiguration.getConfigurationFormGroup('');
    this.canCreateNewConfiguration();
  }

  // Une fois que le téléchargement du périphérique choisit est terminé (avec succès)
  getDeviceFromComponent(device: Device) {
    this.currentDevice = device;
    this.getAllUserDeviceConfigurations(this.currentDevice);
  }

  deviceLoadFailed() {
    this.goBack();
  }

  goToDeviceUrl() {
    const deviceUrl = this.currentDevice.getDeviceConfigurationUrl();
    if (!deviceUrl) {
      this.dialogsService.showOkMessage($localize`Error`, `Error, can't get the deviceUrl`).subscribe({
        next: () => {
          this.goBack();
          return;
        },
      });
      return;
    }
    const link = ['/' + deviceUrl, this.currentDevice.DeviceId, this.configurationId, '0'];
    this.router.navigate(link);
  }

  // Retourne la liste de toutes les configuration utilisateur pour ce périphérique
  getAllUserDeviceConfigurations(device: IDeviceResponse) {
    const requestedDevice: IDeviceConfigurationRequest = {
      Firmware: device.Firmware,
      Hardware: device.Hardware,
      Name: device.Name,
    };
    this.configurationsService.getMyConfigurationForDevice(requestedDevice).subscribe({
      next: (configurations: IConfigurationSummary[]) => {
        this.configurations$ = configurations;
        this.configurationsLoaded = true;
        // S'il n'y a pas de configuration créée par l'utilisateur pour ce périphérique on passe tout de suite à l'écran de création d'une configuration
        /*if (this.configurations$.length === 0) {
          this.configurationId = 0;
          this.goToDeviceUrl();
        }*/
      },
      error: (error: HttpErrorResponse) => {
        this.configurationsLoaded = true;
        console.error('Error while getting the list of user configurations for this device', error);
        const title = $localize`Error during a network request`;
        let message = $localize`There was an error while asking for the list of configurations for this device:` + '\n' + error.message;
        if (error.status === 404) {
          message += '\n' + error.error.Message;
        }
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getAllUserDeviceConfigurations(device);
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

  // Quand l'utilisateur décide d'utiliser une configuration existante
  useExistingConfiguration() {
    this.configurationId = 0;
    // On récupère l'ID de la configuration sélectionnée
    const configId = getFieldValue(this.actionForm, 'selectedConfiguration');
    if (!configId) {
      return;
    }
    if (configId) {
      this.configurationId = configId;
    }
    this.goToDeviceUrl();
  }

  // Quand l'utilisateur décide de créer une nouvelle configuration pour ce périphérique en particulier
  createNewConfiguration() {
    const componentName = this.currentDevice.getDeviceConfigurationUrl();
    if (!componentName) {
      this.dialogsService.showOkMessage($localize`Error`, `Error, can't get the deviceUrl`).subscribe({
        next: () => {
          this.goBack();
          return;
        },
      });
      return;
    }

    // Création d'un nouveau projet
    const uuid = Project.getUuid();
    const project = new Project(uuid, componentName);
    project.deviceId = this.deviceId;
    project.componentName = componentName;
    project.configurationName = getFieldValue(this.configurationForm, 'title');
    project.configurationDescription = getFieldValue(this.configurationForm, 'description');
    //project.configurationIsFavorite = getFieldValue(this.configurationForm, 'favorites');
    project.save();
    const link = ['/' + componentName, this.currentDevice.DeviceId, this.configurationId, uuid];
    this.router.navigate(link);
  }

  // Est-ce que l'utilisateur peut créer une nouvelle configuration ?
  canCreateNewConfiguration() {
    this.overLimit = false;
    if (this.authService.getType() === 2) {
      // Les comptes team peuvent tout faire
      return;
    }
    this.authService.canCreateConfiguration().subscribe(
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
}
