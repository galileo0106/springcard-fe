import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@shared/classes/Device';
import { Devices } from '@shared/classes/Devices';
import { Project } from '@shared/classes/Project';
import { Registers } from '@shared/classes/Registers';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { IFieldAndRegisterDefinition } from '@shared/models/ifieldandregisterdefinition.model';
import { ApplicationService } from '@shared/services/application.service';
import { ConfigurationsService, IDeviceSpecificRegister } from '@shared/services/configurations.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FormsUtilsService } from '@shared/services/forms-utils.service';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';
import { Subscription } from 'rxjs';
import { IndividualsFieldsDefinition } from './individuals-fields-definition';
import { IndividualsFormGroup } from './individuals-form-group';
import { IndividualsGetFieldsList } from './individuals-get-fields-list';
import { getUserInformation } from '@shared/appSettings';
import { IIndividualsConfigurationLog } from '@shared/models/Configuration/iindividuals.configuration.log.model';
import { ICanDoSomethingJsonResponse } from '@shared/models/icandosomethingjsonresponse.model';
import { AuthService } from '@shared/services/AuthService';
import { INewHistory } from '@shared/models/User/inewhistory.model';

/**
 * Paramétrage des registres individuels d'un périphérique spécifique
 */
@Component({
  selector: 'app-individuals',
  templateUrl: './individuals.component.html',
  styleUrls: ['../sharedstyles.css', './individuals.component.scss'],
})
export class IndividualsComponent implements OnInit, OnDestroy {
  deviceId = ''; // L'identifiant de device reçu sur la route
  currentDevice: Device;
  deviceDefinition: IDeviceList; // Contient la signature (définition) du périphérique, telle que décrite dans devicesList.ts
  asyncOperation = false;
  currentAsyncOperationTitle = '';
  configurationForm: UntypedFormGroup;
  individualsFieldsDefinition: Record<string, IFieldAndRegisterDefinition> = IndividualsFieldsDefinition;
  individualsGetFieldsList = IndividualsGetFieldsList;
  deviceRegistersConfiguration: Registers;
  configurationFormChanges: Subscription; // Sert à être informé des changements dans le formulaire de configuration
  project: Project;
  changeDataOfLabel = $localize`Change data of`;
  uuid = '';

  constructor(
    public dialogsService: DialogsService,
    public snackBar: MatSnackBar,
    public configurationsService: ConfigurationsService,
    public route: ActivatedRoute,
    private router: Router,
    private currentTitleService: CurrentTitleService,
    public fb: UntypedFormBuilder,
    public formsUtilsService: FormsUtilsService,
    public valdemortConfig: ValdemortConfig,
    private app: ApplicationService,
    public elementRef: ElementRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.asyncOperation = true;
    this.currentTitleService.changeTitle($localize`Change device specific data`);
    this.valdemortConfig.displayMode = DisplayMode.ONE;
    this.valdemortConfig.shouldDisplayErrors = () => true;

    // Pour l'instant, sur la route permettant d'accéder à cet écran, on attend un paramètre deviceId
    this.searchRouteParameters();
    this.createProject();
    this.canEnterInventoryData();
  }

  ngOnDestroy() {
    this.formsUtilsService.stopMonitoringFormForPersisting();
    if (this.configurationFormChanges) {
      this.configurationFormChanges.unsubscribe();
    }
  }

  createProject() {
    this.uuid = Project.getUuid();
    this.project = new Project(this.uuid);
    this.project.deviceId = this.deviceId;
    this.project.componentName = 'individuals'; // @todo, vérifier
    this.project.save();
  }

  createConfigurationForm() {
    this.configurationForm = new UntypedFormGroup(IndividualsFormGroup);
    this.formsUtilsService.elementRef = this.elementRef;
    this.deviceRegistersConfiguration = new Registers(this.configurationForm, this.individualsFieldsDefinition);
    this.formsUtilsService.setWorkingObjects(
      this.configurationForm,
      this.project,
      this.deviceRegistersConfiguration,
      this.project.componentName,
      1,
      -1,
    );

    // Le callback qui permet d'avoir la liste des champs du formulaire à prendre en compte en fonction des conditions (templates Desfire par exemple)
    this.deviceRegistersConfiguration.setFormFieldsListCallback(this.individualsGetFieldsList);

    // 1) On charge les valeurs des champs du formulaire avec les définitions PAR DEFAUT du périphérique
    this.formsUtilsService.createInitialFormValuesFromDefinition(this.configurationForm, this.individualsFieldsDefinition);

    // On sauvegarde les données initiales du formulaire en cas de reset() de la part de l'utilisateur
    this.formsUtilsService.saveFormInitialValues(this.configurationForm); // Sauvegarde du formgroup avec les valeurs initiales

    // A chaque changement valide dans le formulaire on enregistre la saisie dans le projet et on recalcule la valeur des registres
    this.formsUtilsService.startMonitoringFormToPersist();

    // A chaque changement dans le formulaire on est notifié pour voir si la configuration a évoluée et si on a toujours des templates
    this.getConfigurationFormChangesNotifications();
  }

  // A chaque changement **valide** du formulaire de configuration on ajuste la présence du bouton des templates
  getConfigurationFormChangesNotifications() {
    //throw new Error('Method not implemented.');
    this.configurationFormChanges = this.formsUtilsService.formChangesSubscriber$.subscribe(() => {});
  }

  // Charge les registres spécifiques du lecteur sur lequel on travaille
  loadDeviceSpecificRegisters() {
    this.asyncOperation = true;
    this.configurationsService.getDeviceSpecificRegistersValues(this.deviceId).subscribe(
      (configuration: IDeviceSpecificRegister) => {
        this.asyncOperation = false;
        this.loadDeviceConfigurationIntoConfigurationForm(configuration);
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        console.error('Error while getting the list of specific registers for the selected device', error);
        const title = $localize`Error during a network request`;
        let message = $localize`There was an error while asking for the list of specific registers for this device:` + '\n' + error.message;
        if (error.status === 404 && error.error.Message) {
          message += '\n' + error.error.Message;
        }
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.loadDeviceSpecificRegisters();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Place la configuration qui a été chargée depuis le lecteur, dans le formulaire de configuration
  loadDeviceConfigurationIntoConfigurationForm(configuration: IDeviceSpecificRegister): void {
    this.asyncOperation = true;
    if (configuration === null) {
      return;
    }
    this.deviceRegistersConfiguration.setFormContent({}, configuration);
    this.formsUtilsService.saveFormInitialValues(this.configurationForm);
    this.asyncOperation = false;
  }

  // Recherche des paramètres dans la route, pour l'instant on part du principe qu'on va avoir ce paramètre et on ne met donc pas en place de test
  searchRouteParameters() {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId') != null ? (this.route.snapshot.paramMap.get('deviceId') as string) : '0';
  }

  // Méthode appelée par le composant DeviceInformationsComponent lorsque le téléchargement du périphérique échoue
  deviceLoadFailed() {
    this.asyncOperation = false;
    this.dialogsService.showOkMessage($localize`Error`, $localize`It was not possible to find the device you selected`).subscribe({
      next: () => {},
    });
    this.goBack();
  }

  // Retour à la home (en cas de problème par exemple)
  goBack(): void {
    this.router.navigate(['/']);
  }

  logDeviceConfigured() {
    const userInfo = getUserInformation();
    const device = new Device(this.currentDevice);
    const individualsConfigurationLog: IIndividualsConfigurationLog = {
      UniqueId: this.currentDevice.UniqueId,
      Firmware: this.currentDevice.Firmware,
      Hardware: this.currentDevice.Hardware,
      Name: this.currentDevice.Name,
      Version: this.currentDevice.Version,
      NumericalVersion: device.NumericalVersion,
      Profile: this.currentDevice.Profile,
      Mode: this.currentDevice.Mode,
      MachineName: userInfo.MachineName,
      ComputerName: userInfo.ComputerName,
      UserName: userInfo.UserName,
      Location: this.currentDevice.Location,
      Inventory: this.currentDevice.Inventory,
    };
    this.configurationsService.logIndividualsConfigured(individualsConfigurationLog).subscribe();
  }

  // Applique la configuration au périphérique
  apply() {
    this.asyncOperation = true;
    const configuration = this.project.getRegistersConfigurationForDeviceAndTemplates();
    this.configurationsService.writeDeviceIndividualRegisters(configuration, this.deviceId).subscribe(
      () => {
        this.logDeviceConfigured();
        this.asyncOperation = false;
        this.snackBar.open(
          $localize`Configuration was sent with success. The device is restarting to apply the new configuration, please wait...`,
          $localize`Success`,
          {
            duration: 5000,
          },
        );
        const newHistoryModel: INewHistory = {
          action: 'Device data changed',
          device_name: this.currentDevice.FriendlyName,
          serial_number: this.currentDevice.SerialNumber,
        }
        this.authService.setHistory(newHistoryModel).subscribe();
      },
      (error: HttpErrorResponse) => {
        this.logDeviceConfigured();
        this.asyncOperation = false;
        console.error('Error while writing the list of specific registers for the selected device', error);
        const title = $localize`Error during a network request`;
        let message = $localize`There was an error while writing the specific registers for this device:` + '\n' + error.message;
        if (error.status === 404 && error.error.Message) {
          message += '\n' + error.error.Message;
        }
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.apply();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  /**
   * Est-ce que le périphérique courant dispose de la liste de registres reçus en paramètre ?
   * Permet de masquer des <mat-expansion-panel> dans la vue pour des registres qui ne sont pas présents dans un lecteur
   */
  hasRegisters(registersToFind: string[]): boolean {
    if (!this.deviceDefinition) {
      return true;
    }
    const deviceIndividualRegisters = this.deviceDefinition.individuals;
    if (registersToFind.length === 0) {
      return true;
    }
    for (const register of registersToFind) {
      if (deviceIndividualRegisters.indexOf(register) === -1) {
        return false;
      }
    }
    return true;
  }

  // Méthode appelée par le composant DeviceInformationsComponent lorsque le téléchargement du périphérique fonctionne
  getDeviceFromComponent(device: Device) {
    this.asyncOperation = false;
    this.currentDevice = device;
    this.loadDeviceSpecificRegisters();
    const devices = new Devices();
    devices.setDataFromServer(this.currentDevice);
    const deviceDefinition = devices.getDeviceFromServiceData();
    if (deviceDefinition === null) {
      this.snackBar.open('It was not possible to find device definition !!', 'Error', {
        duration: 4000,
      });
      this.goBack();
    } else {
      this.deviceDefinition = deviceDefinition;
      this.refineFieldsDefinition();
      this.createConfigurationForm();
    }
  }

  // Permet de redéfinir la liste des champs et donc des registres dont le périphérique courant dispose
  refineFieldsDefinition() {
    const currentDeviceIndividualRegisters = this.deviceDefinition.individuals;
    const newFieldsDefinition: Record<string, IFieldAndRegisterDefinition> = {};
    for (const key of Object.keys(this.individualsFieldsDefinition)) {
      const fieldDefinition: IFieldAndRegisterDefinition = this.individualsFieldsDefinition[key];
      const registerId = fieldDefinition.register;
      if (currentDeviceIndividualRegisters.indexOf(registerId) !== -1) {
        newFieldsDefinition[key] = fieldDefinition;
      }
    }
    this.individualsFieldsDefinition = newFieldsDefinition;
  }

  canEnterInventoryData() {
    this.authService.canEnterInventoryData().subscribe(
      (response: ICanDoSomethingJsonResponse) => {
        if (response.Result === false) {
          this.snackBar.open($localize`With your actual plan you can't enter inventory data`, $localize`Error`, {
            duration: 7000,
          });
          this.router.navigate(['/']);
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      },
    );
  }
}
