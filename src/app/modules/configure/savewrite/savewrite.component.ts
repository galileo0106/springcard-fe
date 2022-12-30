import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { getFieldValue, hasCheatCode } from '@shared/appSettings';
import { Device } from '@shared/classes/Device';
import { Devices } from '@shared/classes/Devices';
import { Misc } from '@shared/classes/Misc';
import { IndividualsMethod, ProductConfiguration } from '@shared/classes/ProductConfiguration';
import { Project } from '@shared/classes/Project';
import { IRegistersValuesAsString } from '@shared/classes/Registers';
import { IConfigurationWriteResponse } from '@shared/models/Configuration/configuration.write.response.model';
import { IConfigurationToSaveResponse } from '@shared/models/Configuration/configurations.to.save.response.model';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { ICanDoSomethingJsonResponse } from '@shared/models/icandosomethingjsonresponse.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { IIsDirty } from '@shared/services/can-deactivate-guard.service';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FormsUtilsService } from '@shared/services/forms-utils.service';
import { SettingsService } from '@shared/services/settings.service';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { DetectionService } from '../../detection/detection.service';
import { INewHistory } from '@shared/models/User/inewhistory.model';

/**
 * Enregistre la configuration dans le back office et permet de l'appliquer à un périphérique
 */
@Component({
  selector: 'app-savewrite',
  templateUrl: './savewrite.component.html',
  styleUrls: ['../sharedstyles.css'],
})
export class SavewriteComponent implements OnInit, OnDestroy, IIsDirty {
  deviceDefinition: IDeviceList; // Correspond à la définition du composant (périphérique) qui a été choisi par l'utilisateur (qui se trouve dans devicesList.ts)
  topButtons = Array<ITopButton>();
  private productConfiguration: ProductConfiguration; // La classe qui permet de sauvegarder la configuration dans le back office
  private readonly thisComponentName = 'SavewriteComponent'; // le nom de CE composant et pas du composant du périphérique

  currentUserDevice: IDeviceResponse; // Le périphérique qui avait été sélectionné par l'utilisateur et qui est retourné par le service de Companion
  asyncOperation = false;
  overLimit = false;
  limitLabel = $localize`configurations you can send to a device`;
  asyncOperationTitle = '';
  configurationDetailsForm: UntypedFormGroup; // Le formulaire qui permet de saisir le nom et la description de la configuration
  downloadingDevicesList = false;
  errorWhileDetecting = false;
  errorMessage = '';
  devices: Device[] = [];
  project: Project;
  buttonsSubscription: Subscription;
  isInReadOnlyMode = false;
  configurationDetailsFormChanges: Subscription; // Pour surveiller les changements du formulaire de configuration
  isRunningWithoutService = false;

  // Les paramètres (obligatoires) reçus dans la route
  deviceId = '';
  deviceUniqueId = '';
  configId = 0;
  uuid = '';
  componentName = '';

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: Event) {
    if (!this.configurationDetailsForm.dirty) {
      $event.returnValue = true;
      return;
    }
    $event.returnValue = confirm($localize`You are going to leave configuration, please confirm it.`);
  }

  constructor(
    private currentTitleService: CurrentTitleService,
    private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private dialogsService: DialogsService,
    private snackBar: MatSnackBar,
    private configurationsService: ConfigurationsService,
    private router: Router,
    private app: ApplicationService,
    private valdemortConfig: ValdemortConfig,
    private elementRef: ElementRef,
    private formsUtilsService: FormsUtilsService,
    private detectService: DetectionService,
    private deviceInformationsButtonsService: DeviceInformationsButtonsService,
    private authService: AuthService,
    private settings: SettingsService,
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.saveWriteButtonsClicks();
    this.valdemortConfig.displayMode = DisplayMode.ONE;
    this.valdemortConfig.shouldDisplayErrors = () => true;
    // Récupération des paramètres de la route + recherche définition du composant du périphérique + chargement du projet
    this.getRouteParameters(); // Après cet appel, tous les paramètres de la route sont connus, il faut donc lancer cette action en premier
    this.createStartupObjects();
    this.createTopButtons();
    this.createConfigurationForm();
    this.getDevicesList();
    this.canLoadConfiguration();
  }

  ngOnDestroy() {
    this.formsUtilsService.stopMonitoringFormForPersisting();
    if (this.buttonsSubscription) {
      this.buttonsSubscription.unsubscribe();
    }
    if (this.configurationDetailsFormChanges) {
      this.configurationDetailsFormChanges.unsubscribe();
    }
  }

  loadSettings() {
    this.isRunningWithoutService = this.settings.getBoolean('runWithoutService', false);
  }

  createStartupObjects() {
    this.currentTitleService.changeTitle($localize`Configuration - ` + this.deviceDefinition.title);
    // L'objet qui va permettre d'enregistrer la configuration auprès du back office et de pousser la configuration au lecteur
    this.productConfiguration = new ProductConfiguration(this.configurationsService);
    this.productConfiguration.firmware = this.deviceDefinition.firmware;
    this.productConfiguration.hardware = this.deviceDefinition.hardware;
    this.productConfiguration.name = this.deviceDefinition.title;
    this.productConfiguration.formBuilder = this.fb;
    this.productConfiguration.deviceId = this.deviceId;
    this.productConfiguration.uniqueId = this.deviceUniqueId;
  }

  /**
   * Création du formulaire qui permet de donner un nom, une description et de
   * "favoriser" la configuration pour ensuite l'envoyer au back office ou au
   * périphérique
   */
  createConfigurationForm() {
    // Si l'utilisateur a démarré en demandant la configuration d'un produit, il
    // faut le sélectionner par défaut dans le formulaire qui permet d'appliquer
    // la configuration à un péripéhrique existant et connecté
    const defaultDeviceId = this.deviceId !== '0' ? this.deviceId : '';
    this.configurationDetailsForm = this.productConfiguration.getConfigurationFormGroup(defaultDeviceId);
    this.formsUtilsService.elementRef = this.elementRef;

    this.formsUtilsService.setParametersForLightForm(this.configurationDetailsForm, this.project, this.thisComponentName, 0, -2);

    // Récupération des anciennes valeurs s'il y en a
    this.loadPreviousConfiguration();

    // On sauvegarde les données initiales du formulaire en cas de reset() de la part de l'utilisateur
    this.formsUtilsService.saveFormInitialValues(this.configurationDetailsForm); // Sauvegarde du formgroup avec les valeurs initiales

    // A chaque changement valide dans le formulaire on enregistre la saisie dans le projet
    this.formsUtilsService.startMonitoringFormToPersist();
    this.getConfigurationFormChangesNotifications();

    if (this.isInReadOnlyMode) {
      this.configurationDetailsForm.disable();
    } else {
      this.configurationDetailsForm.enable();
    }
  }

  // Mise à jour du project à chaque fois que le contenu du formulaire change
  getConfigurationFormChangesNotifications() {
    this.configurationDetailsFormChanges = this.configurationDetailsForm.valueChanges
      .pipe(
        filter(() => this.configurationDetailsForm.valid),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(() => this.saveConfigurationToBackOffice(false)),
      )
      .subscribe();
  }

  // Sauvegarde du projet
  private updateProject() {
    this.project.configurationDescription = getFieldValue(this.configurationDetailsForm, 'description');
    this.project.configurationName = getFieldValue(this.configurationDetailsForm, 'title');
    //this.project.configurationIsFavorite = getFieldValue(this.configurationDetailsForm, 'favorites');
    this.project.deviceId = getFieldValue(this.configurationDetailsForm, 'devices');
    this.project.save();
  }

  // Charge une version précédente de l'écran de paramétrage du formulaire
  loadPreviousConfiguration() {
    const componentConfiguration = this.project.getComponentConfiguration(this.thisComponentName, -2);
    if (componentConfiguration !== null) {
      this.configurationDetailsForm.reset();
      this.configurationDetailsForm.patchValue(JSON.parse(componentConfiguration.form));
      this.configurationDetailsForm.updateValueAndValidity();
      this.formsUtilsService.saveFormInitialValues(this.configurationDetailsForm);
    }
    this.loadProjectSettingsIntoConfigurationForm();
    if (this.isInReadOnlyMode) {
      this.configurationDetailsForm.disable();
    } else {
      this.configurationDetailsForm.enable();
    }
  }

  // Rechargement, dans le formulaire de la page, des paramètres de la configuration (nom, description, etc)
  loadProjectSettingsIntoConfigurationForm() {
    // favorites: this.project.configurationIsFavorite,
    this.configurationDetailsForm.patchValue({
      title: this.project.configurationName,
      description: this.project.configurationDescription,

      method: 'ERASE_ALL_KEEP_INDIVIDUAL',
    });
  }

  // Mise en place des boutons présents en haut de la page
  createTopButtons() {
    this.topButtons = [
      {
        label: $localize`Global configuration`,
        color: 'warn',
        type: 'raised-icon-with-text',
        icon: 'developer_board',
        id: 'btnDevice',
      },
    ];

    if (this.deviceDefinition.templatesBle || this.deviceDefinition.templatesNfc) {
      this.topButtons.push({
        label: $localize`Templates`,
        color: 'warn',
        type: 'raised-icon-with-text',
        icon: 'credit_card',
        id: 'btnTemplates',
      });
    }

    if (this.isInReadOnlyMode) {
      this.topButtons.push({
        label: $localize`Edit mode`,
        color: 'warn',
        type: 'raised-icon-with-text',
        icon: 'edit',
        id: 'btnEditMode',
      });
    }
  }

  // Est-ce que l'écran courant de configuration est valide ?
  isConfigurationFormValid(): boolean {
    if (this.configurationDetailsForm.invalid) {
      this.dialogsService.showOkMessage($localize`Error`, $localize`The content of the form is not valid, please correct it.`).subscribe({
        next: () => {},
      });
      return false;
    }
    return true;
  }

  // Permet de ne pas changer de route sans enregister la configuration
  // @ts-ignore
  isDirty(currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
    return true;
  }

  // Retourne les paramètres de la requête à éventuellement mettre en place si on est en mode readonly
  private getQueryParameters(): object {
    let queryParameters = {};
    if (this.isInReadOnlyMode) {
      queryParameters = { readonly: true };
    }
    return queryParameters;
  }

  // Affiche l'écran permettant de configurer les templates
  showTemplatesScreen() {
    if (!this.isConfigurationFormValid()) {
      this.formsUtilsService.setFocusToFirstFieldWithError();
      return;
    }
    if (!this.deviceDefinition.templatesBle || !this.deviceDefinition.templatesNfc) {
      this.dialogsService
        .showOkMessage($localize`Templates`, $localize`According to the configuration, the device does not support templates.`)
        .subscribe({
          next: () => {},
        });
      return;
    }
    this.router.navigate(['/templates', this.deviceId, this.configId, this.componentName, this.uuid], {
      queryParams: this.getQueryParameters(),
    });
  }

  // Retourne à l'écran de configuration du périphérique
  goBackToDevice() {
    if (!this.isConfigurationFormValid()) {
      this.formsUtilsService.setFocusToFirstFieldWithError();
      return;
    }

    this.router.navigate(['/' + this.componentName, this.deviceId, this.configId, this.uuid], { queryParams: this.getQueryParameters() });
  }

  /**
   * Recherche de tous les paramètres qu'on doit recevoir dans la route
   * Première action à lancer
   */
  getRouteParameters() {
    // On cherche à savoir si on a reçu comme paramètre un "vrai" DeviceId auquel cas la configuration peut être appliquée au lecteur sinon on ne peut que la sauvegarder
    // Soit on reçoit '0' pour indiquer qu'on n'est pas lié à un périphérque soit on reçoit un "vrai" DeviceId sous la forme d'une chaine de caractères
    // prettier-ignore
    this.deviceId = this.activatedRoute.snapshot.paramMap.get('deviceId') != null ? (this.activatedRoute.snapshot.paramMap.get('deviceId') as string) : '0';

    // Est-ce qu'une configuration existante a été passée en paramètre ?
    // Soit on reçoit '0' pour indiquer qu'on ne charge pas une configuration existante de l'utilisateur soit on reçoit le numéro de la configuration utilisateur (en provenance du back office)
    // prettier-ignore
    this.configId = this.activatedRoute.snapshot.paramMap.get('configId') != null ? parseInt(this.activatedRoute.snapshot.paramMap.get('configId') as string, 10) : 0;

    // prettier-ignore
    this.uuid = this.activatedRoute.snapshot.paramMap.get('uuid') != null ? (this.activatedRoute.snapshot.paramMap.get('uuid') as string) : '0';
    if (this.uuid === '0') {
      this.dialogsService
        .showOkMessage($localize`Error`, `The configuration UUID is missing from route, you will be brought back to the home page.`)
        .subscribe({
          next: () => {},
        });
      this.goHome();
    }

    // Recherche du nom du périphérique via le nom du composant
    // prettier-ignore
    this.componentName = this.activatedRoute.snapshot.paramMap.get('componentName') != null ? (this.activatedRoute.snapshot.paramMap.get('componentName') as string) : '';
    if (this.componentName === '') {
      this.dialogsService
        .showOkMessage(
          $localize`Error`,
          `It was not possible to find the component name in the route, you will be brought back to the home page.`,
        )
        .subscribe({
          next: () => {},
        });
      this.goHome();
    }

    this.isInReadOnlyMode = this.activatedRoute.snapshot.queryParams['readonly'];
    this.createProject();
    this.searchDeviceFromDevicesListFromComponentName();
  }

  // Chargement du projet qui a été initié par le composant du périphérique et peut être complété par les templates
  createProject() {
    this.project = new Project(this.uuid);
    if (!this.project.load()) {
      this.dialogsService.showOkMessage($localize`Error`, `It was not possible to load the projet, consult the console`).subscribe({
        next: () => {},
      });
      this.goHome();
      return;
    }
  }

  // Recherche, à partir du nom du composant reçu dans l'url, du périphérique sur lequel on travaille (de sa définition)
  searchDeviceFromDevicesListFromComponentName() {
    const devices = new Devices();
    const deviceDefinition: IDeviceList | null = devices.getDeviceFromComponent(this.componentName);
    if (deviceDefinition !== null) {
      this.deviceDefinition = deviceDefinition;
      return;
    }
    // Si on est encore là c'est qu'on ne l'a pas trouvé
    this.dialogsService
      .showOkMessage(
        $localize`Error`,
        `It was not possible to find the definition of the device you are trying to configure, you will be brought back to the home page.`,
      )
      .subscribe({
        next: () => {},
      });
    this.goHome();
  }

  // Demande la liste de tous les périphériques détectables et les filtre pour ne garder que ceux auxquels on peut appliquer la configuration
  getDevicesList() {
    if (this.isRunningWithoutService) {
      return;
    }
    this.errorWhileDetecting = false;
    this.downloadingDevicesList = true;
    this.errorMessage = '';
    this.detectService.getDevicesList().subscribe({
      next: (devices: Device[]) => {
        if (hasCheatCode('sc_applyConfigurationToAny')) {
          this.devices = devices;
        } else {
          // On ne va garder que les périphériques qui sont compatibles avec le périphérique sélectionné ou le type de périphérique sélectionné
          if (this.deviceId === '0') {
            this.devices = devices.filter((element) => {
              return element.Name === this.deviceDefinition.title;
            });
          } else {
            // On a spécifié un périphérique à configurer donc on n'affiche que celui-là
            this.devices = devices.filter((element) => {
              return element.DeviceId === this.deviceId;
            });
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorWhileDetecting = true;
        console.error('Error while getting the list of connected devices', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for your devices list:` + '\n\n' + error.message;
        this.errorMessage = error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getDevicesList();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
      complete: () => {
        this.downloadingDevicesList = false;
      },
    });
  }

  // Enregistre (ajoute ou met à jour) la configuration vers le back office
  saveConfigurationToBackOffice(showAsyncOperation = true): Observable<boolean> {
    return new Observable((observer) => {
      this.updateProject();
      this.logDeviceConfiguration();
      if (this.configurationDetailsForm.invalid) {
        this.dialogsService.showOkMessage($localize`Error`, $localize`The content of the form is invalid, please correct it`).subscribe({
          next: () => {},
        });
        this.formsUtilsService.setFocusToFirstFieldWithError();
        observer.error(false);
        return;
      }

      this.productConfiguration.description = this.project.configurationDescription;
      //this.productConfiguration.favorites = this.project.configurationIsFavorite;
      this.productConfiguration.title = this.project.configurationName;
      this.productConfiguration.configuration = this.project.project; // La configuration au format Angular, ce qui correspond au contenu du projet
      this.productConfiguration.deviceConfiguration = JSON.parse(this.project.getRegistersConfigurationForDeviceAndTemplates());
      if (this.project.id !== 0) {
        this.productConfiguration.id = this.project.id;
      }

      if (showAsyncOperation) {
        this.asyncOperation = true;
        this.asyncOperationTitle = $localize`Saving configuration`;
      }

      this.productConfiguration.saveConfiguration().subscribe({
        next: (response: IConfigurationToSaveResponse) => {
          this.productConfiguration.id = response.id;
          if (this.project.id === 0) {
            this.project.id = response.id;
            this.project.save();
          }
          this.asyncOperationTitle = '';
          this.asyncOperation = false;
          /*this.snackBar.open('Configuration saved with success', 'Success', {
            duration: 4000,
          });*/
          observer.next(true);
        },
        error: (error: HttpErrorResponse) => {
          this.asyncOperationTitle = '';
          this.asyncOperation = false;
          const title = $localize`Error during a network request`;
          const message = $localize`There was an error while saving your configuration:` + '\n\n' + error.message;
          console.error(title, message);
          console.error(error);
          this.errorMessage = error.message;
          this.snackBar.open($localize`Error while saving the configuration` + '\n\n' + error.message, $localize`Error`, {
            duration: 4000,
          });
          observer.error(false);
        },
      });
    });
  }

  // Fonctionnalité pour SC afin de voir la configuration qui va être envoyée au périphérique
  logDeviceConfiguration() {
    if (hasCheatCode('sc_show_registers')) {
      console.info('-== Configuration to be sent to the reader ==-');
      //console.info(JSON.parse(this.project.getRegistersConfigurationForDeviceAndTemplates()));
      console.info(this.project.getRegistersConfigurationForDeviceAndTemplates());
    }
  }

  // Gère l'état du bouton "Write in the device" en fonction de la sélection d'un périphérique
  isDeviceSelected(): boolean {
    const selectedDevice = getFieldValue(this.configurationDetailsForm, 'devices');
    return selectedDevice === null || selectedDevice.trim() === '' ? false : true;
  }

  private setDeviceIntoProductConfiguration() {
    const deviceId: string = getFieldValue(this.configurationDetailsForm, 'devices');
    for (const device of this.devices) {
      if (device.DeviceId === deviceId) {
        this.productConfiguration.device = device;
      }
    }
  }

  // Envoi la configuration au lecteur
  writeToReader() {
    if (this.project.id !== 0) {
      this.productConfiguration.id = this.project.id;
    }
    this.logDeviceConfiguration();
    this.productConfiguration.configuration = this.project.project; // La configuration au format Angular, ce qui correspond au contenu du projet
    this.productConfiguration.deviceConfiguration = JSON.parse(this.project.getRegistersConfigurationForDeviceAndTemplates());
    this.productConfiguration.deviceId = getFieldValue(this.configurationDetailsForm, 'devices');
    if (!this.productConfiguration.isDeviceSet()) {
      this.setDeviceIntoProductConfiguration();
    }

    const method = getFieldValue(this.configurationDetailsForm, 'method');
    if (method === 'ERASE_ALL') {
      this.productConfiguration.specificMethod = IndividualsMethod.Discard;
    } else {
      this.productConfiguration.specificMethod = IndividualsMethod.Preserve;
    }

    this.asyncOperation = true;
    this.asyncOperationTitle = $localize`Transferring configuration, please wait...`;

    this.productConfiguration.writeIntoReader().subscribe({
      next: (result: IConfigurationWriteResponse) => {
        this.asyncOperation = false;
        this.asyncOperationTitle = '';
        let message = $localize`Your configuration was applied with success`;
        let title = $localize`Success`;
        if (result.Result.trim().toLowerCase() === 'success') {
          this.productConfiguration.wasWrittenToDeviceWithSuccess = true;
          if (result.hasOwnProperty('ConfigId') && result.ConfigId) {
            this.productConfiguration.configId = result.ConfigId;
            this.project.ConfigId = result.ConfigId;
            this.project.deviceId = getFieldValue(this.configurationDetailsForm, 'devices');
            this.project.save();
            this.saveConfigurationToBackOffice(); // On envoie le ConfigId au back office
            //Create history
            const newHistoryModel: INewHistory = {
              action: 'Configured with ' + this.productConfiguration.title,
              device_name: this.currentUserDevice.FriendlyName,
              serial_number: this.currentUserDevice.SerialNumber,
            }
            this.authService.setHistory(newHistoryModel).subscribe();
          }
        } else {
          this.productConfiguration.wasWrittenToDeviceWithSuccess = false;
          message = $localize`There was an error while writing configuration to device`;
          title = $localize`Error`;
        }
        this.productConfiguration.saveConfigurationApplied().subscribe();
        this.snackBar.open(message, title, {
          duration: 4000,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        this.asyncOperationTitle = '';
        this.productConfiguration.wasWrittenToDeviceWithSuccess = false;
        console.error('Error while sending the configuration to the device', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while sending the configuration to the device:` + '\n\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.writeToReader();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    });
  }

  /**
   * Permet de récupérer un objet Device depuis DeviceInformationsComponent
   * qui est en charge de récupérer les périphériques passés dans les routes.
   * Cette méthode est appelée par ce composant via la création d'un évènement.
   */
  getDeviceFromComponent(device: Device) {
    this.currentUserDevice = device;
    if (this.currentUserDevice && this.currentUserDevice.UniqueId) {
      this.deviceUniqueId = this.currentUserDevice.UniqueId;
      this.productConfiguration.uniqueId = this.deviceUniqueId;
      this.productConfiguration.device = device;
    }
  }

  /**
   * Méthode appelée par DeviceInformationsComponent (en charge de récupérer
   * les devices passés dans les routes), lorsque le téléchargement du
   * périphérique à échoué.
   */
  deviceLoadFailed() {
    this.dialogsService
      .showOkMessage(
        $localize`Error`,
        `There was an error during the recovery of the device that you had selected, you will be brought back to the home page.`,
      )
      .subscribe({
        next: () => {},
      });
    this.goHome();
  }

  // En cas de problème grave on renvoie l'utilisateur à la page d'accueil de l'application
  goHome(): void {
    this.router.navigate(['/']);
  }

  // Souscription aux clicks sur les boutons présents en haut de la page
  saveWriteButtonsClicks() {
    this.buttonsSubscription = this.deviceInformationsButtonsService.subscriber$.subscribe((buttonId) => {
      switch (buttonId) {
        case 'btnDevice':
          this.goBackToDevice();
          break;

        case 'btnTemplates':
          this.showTemplatesScreen();
          break;

        case 'btnEditMode': // On passe du mode 'visu' au mode édition
          this.isInReadOnlyMode = false;
          this.configurationDetailsForm.enable();
          this.createTopButtons();
          break;
      }
    });
  }

  // Est-ce que l'utilisateur peut toujours charger une configuration dans un lecteur ?
  canLoadConfiguration() {
    this.overLimit = false;
    if (this.authService.getType() === 2) {
      // Les comptes team peuvent tout faire
      return;
    }
    this.authService.canLoadConfiguration().subscribe(
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

  private exportConfigurationToJson(): string {
    const jsConfig = JSON.parse(this.project.getRegistersConfigurationForDeviceAndTemplates());
    const constants: IRegistersValuesAsString = {}; // 01
    const config: IRegistersValuesAsString = {}; // 02
    const templates: IRegistersValuesAsString = {}; // 03
    const keys = Object.keys(jsConfig);
    const configuration = this.productConfiguration;
    for (const key of keys) {
      const value = jsConfig[key];
      if (key.startsWith('01')) {
        constants[key] = value;
      } else if (key.startsWith('02')) {
        config[key] = value;
      } else if (key.startsWith('03')) {
        templates[key] = value;
      } else {
        console.error('Unknown key :', key, value);
      }
    }

    const output: any = {};
    output['type'] = 'multiconf-v2';
    output['title'] = configuration.title;
    output['description'] = configuration.description;
    output['favorites'] = configuration.favorites;
    output['firmware'] = configuration.firmware;
    output['hardware'] = configuration.hardware;
    output['name'] = configuration.name;
    output['uniqueId'] = configuration.uniqueId;
    output['configId'] = configuration.configId;
    output['configuration'] = configuration.configuration;
    output['device_config'] = configuration.deviceConfiguration;
    // if (Object.keys(constants).length > 0) {
    //   output['constants'] = constants;
    // }
    // if (Object.keys(config).length > 0) {
    //   output['config'] = config;
    // }
    // if (Object.keys(templates).length > 0) {
    //   output['templates'] = templates;
    // }
    return JSON.stringify(output, null, '    ');
  }

  exportAsJson(): void {
    const filename = Misc.sanitizeFilename(this.project.configurationName) + '.json';
    const content = this.exportConfigurationToJson();
    const element = document.createElement('a');
    const fileType = 'text/json';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    var event = new MouseEvent('click');
    element.dispatchEvent(event);
  }
}
