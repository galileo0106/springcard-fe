import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { Device } from '@shared/classes/Device';
import { Devices } from '@shared/classes/Devices';
import { ProductConfiguration } from '@shared/classes/ProductConfiguration';
import { Project } from '@shared/classes/Project';
import { Registers } from '@shared/classes/Registers';
import { TemplatesList } from '@shared/configurations/templatesList';
import { IConfigurationDetails } from '@shared/models/Configuration/configuration.details.models';
import { IConfigurationToSaveResponse } from '@shared/models/Configuration/configurations.to.save.response.model';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { IConfigurationFormSettingsAnswer } from '@shared/models/Configuration/iconfiguration.form.settings.answer.interface';
import { IConfigurationFormSettings } from '@shared/models/Configuration/iconfiguration.form.settings.interface';
import { ITemplatesList } from '@shared/models/Device/ideviceslist.model';
import { IProject } from '@shared/models/iproject.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { IIsDirty } from '@shared/services/can-deactivate-guard.service';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FormsUtilsService } from '@shared/services/forms-utils.service';
import { PageOrAppQuitService } from '@shared/services/page-or-app-quit.service';
import { Observable, Subscription } from 'rxjs';

/**
 * Classe qui sert de base à tous les composants qui servent à configurer les périphériques
 */
@Component({
  selector: 'app-device',
  template: ` NO UI! `,
  styleUrls: ['./device.component.css'],
})
export class DeviceComponent implements OnInit, OnDestroy, IIsDirty {
  public templatesList: ITemplatesList[] = TemplatesList;
  public deviceDefinition: IDeviceList; // Contient la signature (définition) du périphérique, telle que décrite dans devicesList.ts
  public topButtons = Array<ITopButton>();
  public configurationForm: UntypedFormGroup;
  public deviceRegistersConfiguration: Registers;
  public isConfigurationSaved = false;
  public hasBleTemplates = false;
  public hasNfcTemplates = false;
  public deviceId = '';
  public configId = -1;
  public currentDevice: IDeviceResponse;
  public downloadingConfiguration = true;
  public uuid = '';
  public asyncOperation = false;
  initialUuid = '';
  public project: Project;
  public childComponentName = ''; // Le nom du composant (de lecteur) qui étend cette classe, utilisé par les templates pour pouvoir revenir en arrière
  public buttonsSubscription: Subscription; // Sert à détecter les clics sur les boutons d'entête
  public configurationFormChanges: Subscription; // Sert à être informé des changements dans le formulaire de configuration
  public configurationName = ''; // Sert à afficher le nom de la configuration dans la barre du haut qui donne les informations du lecteur
  public isInReadOnlyMode = false;
  public deviceFirmware = ''; // Tel que celui qui se trouve dans devicesList.ts
  public deviceHardware = ''; // Tel que celui qui se trouve dans devicesList.ts
  public deviceTitle = ''; // Tel que celui qui se trouve dans devicesList.ts
  fieldsDefinition: any; // La définition des champs du formulaire au format Reactive Form d'Angular
  productConfiguration: ProductConfiguration; // La classe qui permet de sauvegarder la configuration dans le back office
  private configurationFormControls: any;
  public advanced = false;
  statusColor = '';
  statusTooltip = '';
  statusIcon = '';

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = confirm($localize`You are going to leave configuration, please confirm it.`);
  }

  constructor(
    public formsUtilsService: FormsUtilsService,
    public dialogsService: DialogsService,
    public snackBar: MatSnackBar,
    public elementRef: ElementRef,
    public configurationsService: ConfigurationsService,
    public route: ActivatedRoute,
    public app: ApplicationService,
    public router: Router,
    public deviceInformationsButtonsService: DeviceInformationsButtonsService,
    public pageOrAppQuitService: PageOrAppQuitService,
    public fb: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.manageDeviceButtonsClicks();
    this.setAdvancedMode();
    if ( localStorage.getItem('sc_advanced_mode') == 'true' )
      this.advanced = true;
    else this.advanced = false;
  }

  ngOnDestroy() {
    this.formsUtilsService.stopMonitoringFormForPersisting();
    if (this.buttonsSubscription) {
      this.buttonsSubscription.unsubscribe();
    }
    if (this.configurationFormChanges) {
      this.configurationFormChanges.unsubscribe();
    }

    // Pour une raison que j'ignore, le formulaire garde les valeurs saisies d'un appel/affichage à un autre
    // Le seul moyen que j'ai trouvé de "nettoyer" ces valeurs c'est en les réinitialisant
    this.formsUtilsService.createInitialFormValuesFromDefinition(this.configurationForm, this.fieldsDefinition);
    this.formsUtilsService.saveFormInitialValues(this.configurationForm);
    this.isInReadOnlyMode = false;
    this.configurationForm.enable();
  }

  // Mise en place du nom du composant (de lecteur) qui étend cette classe, de manière à permettre aux templates de revenir à la configuration du lecteur
  setChildComponentName(name: string) {
    this.childComponentName = name;
  }

  // Récupération des informations sur le type de périphérique sur lequel on est en train de travailler (depuis sa définition (deviceList.ts) et pas depuis un périphérique connecté)
  setDeviceInformation(firmware: string, hardware: string, title: string) {
    this.deviceFirmware = firmware;
    this.deviceHardware = hardware;
    this.deviceTitle = title;
  }

  /**
   * Recherche de tous les paramètres attendus dans la route (et création du projet dans la localStorage) :
   * URL d'appel sous la forme : 'Ean17115SpringcoreH518ReferenceComponent/:deviceId/:configId/:uuid'
   */
  searchRouteParameters() {
    // Est-ce qu'on a reçu un vrai deviceId ou pas ?
    // Soit on reçoit '0' pour indiquer qu'on n'est pas lié à un périphérque soit on reçoit un "vrai" DeviceId sous la forme d'une chaine de caractères
    // prettier-ignore
    this.deviceId = this.route.snapshot.paramMap.get('deviceId') != null ? (this.route.snapshot.paramMap.get('deviceId') as string) : '0';

    // Est-ce qu'il faut charger une configuration existante depuis le back office ?
    // Soit on reçoit '0' pour indiquer qu'on ne charge pas une configuration existante de l'utilisateur soit on reçoit le numéro de la configuration utilisateur
    // prettier-ignore
    this.configId = this.route.snapshot.paramMap.get('configId') != null ? parseInt(this.route.snapshot.paramMap.get('configId') as string, 10) : 0;

    // Recherche dans l'url d'un UUID qui sert de racine aux sauvegardes du contenu des différents formulaires
    // prettier-ignore
    this.uuid = this.route.snapshot.paramMap.get('uuid') != null ? (this.route.snapshot.paramMap.get('uuid') as string) : '0';
    this.initialUuid = this.uuid;

    // Est-ce qu'on est en mode read-only ?
    this.isInReadOnlyMode = this.route.snapshot.queryParams['readonly'];

    this.createProject();
  }

  /**
   * Création de l'objet qui contient le formulaire de configuration
   * Sauvegarde des valeurs initiales du formulaire pour faire un reset
   * Début du monitoring du formulaire pour enregistrer les valeurs au fur
   * et à mesure de leur saisie et création de l'objet qui permet de calculer
   * la valeur des registres
   */
  createConfigurationObjects(configFormObject: any, fieldsDefinition: any, fieldsListCallback: any) {
    this.configurationFormControls = configFormObject;
    this.configurationForm = new UntypedFormGroup(configFormObject);
    this.fieldsDefinition = fieldsDefinition;

    this.formsUtilsService.elementRef = this.elementRef;
    this.deviceRegistersConfiguration = new Registers(this.configurationForm, fieldsDefinition);

    // prettier-ignore
    this.formsUtilsService.setWorkingObjects(this.configurationForm, this.project, this.deviceRegistersConfiguration, this.project.componentName, 1, -1);

    // Le callback qui permet d'avoir la liste des champs du formulaire à prendre en compte en fonction des conditions (templates Desfire par exemple)
    this.deviceRegistersConfiguration.setFormFieldsListCallback(fieldsListCallback);

    // 1) On charge les valeurs des champs du formulaire avec les définitions PAR DEFAUT du périphérique
    this.formsUtilsService.createInitialFormValuesFromDefinition(this.configurationForm, this.fieldsDefinition);

    // 2) Si on doit récupérer une configuration
    this.loadExistingConfiguration();

    // On sauvegarde les données initiales du formulaire en cas de reset() de la part de l'utilisateur
    this.formsUtilsService.saveFormInitialValues(this.configurationForm); // Sauvegarde du formgroup avec les valeurs initiales

    // A chaque changement valide dans le formulaire on enregistre la saisie dans le projet et on recalcule la valeur des registres
    this.formsUtilsService.startMonitoringFormToPersist();

    // A chaque changement dans le formulaire on est notifié pour voir si la configuration a évoluée et si on a toujours des templates
    this.getConfigurationFormChangesNotifications();

    if (this.isInReadOnlyMode) {
      this.configurationForm.disable();
    }
  }

  // S'il y a une configuration précédente à charger (depuis le back office ou depuis la localStorage) on la récupère
  loadExistingConfiguration(): void {
    this.downloadingConfiguration = false;
    if (this.configId !== 0) {
      this.loadExistingConfigurationFromServer();
    } else if (this.initialUuid !== '0') {
      this.setProjectConfigurationIntoConfigurationForm();
    }
  }

  // On recherche dans la liste des périphériques connus le DeviceId qu'on reçu dans l'URL @todo, voir à déplacer plus haut dans la liste des appels
  searchCurrentDeviceInDevicesList() {
    this.hasBleTemplates = false;
    this.hasNfcTemplates = false;
    const devices = new Devices();
    const deviceItem: IDeviceList | null = devices.getDeviceFromFirmwareAndTitle(this.deviceFirmware, this.deviceTitle);
    if (deviceItem !== null) {
      this.deviceDefinition = deviceItem;
      this.hasBleTemplates = this.deviceRegistersConfiguration.deviceHasBle(this.deviceDefinition);
      this.hasNfcTemplates = this.deviceRegistersConfiguration.isDeviceInReaderMode(this.deviceDefinition);
      return;
    }

    // Si on est encore là c'est que le périphérique passé en paramètre n'existe pas il n'y a donc aucune raison de continuer
    this.dialogsService.showOkMessage($localize`Error`, `The DeviceId received from the previous page can't be found!`).subscribe({
      next: () => {},
    });
    this.goHome();
  }

  // Mise en place des boutons du haut de l'écran ainsi que leur gestion
  setTopButtons() {
    this.topButtons = [];
    this.topButtons.push({
      label: $localize`Apply to device`,
      type: 'raised-icon-with-text',
      icon: 'save_alt',
      color: 'warn',
      id: 'btnSave',
    });

    // Si le lecteur a des templates
    if (this.hasBleTemplates || this.hasNfcTemplates) {
      this.topButtons.push({
        label: $localize`Templates`,
        color: 'warn',
        type: 'raised-icon-with-text',
        icon: 'credit_card',
        id: 'btnTemplates',
      });
    }

    if (!this.isInReadOnlyMode) {
      this.topButtons.push({
        label: $localize`Reset`,
        color: 'primary',
        type: 'raised-icon-with-text',
        icon: 'clear',
        id: 'btnReset',
      });
    } else {
      this.topButtons.push({
        label: $localize`Edit mode`,
        color: 'warn',
        type: 'raised-icon-with-text',
        icon: 'edit',
        id: 'btnEditMode',
      });
    }
  }

  // Instanciation de la classe productConfiguration avec les bons paramètres
  createProductConfiguration() {
    this.productConfiguration = new ProductConfiguration(this.configurationsService);
    this.productConfiguration.firmware = this.deviceDefinition.firmware;
    this.productConfiguration.hardware = this.deviceDefinition.hardware;
    this.productConfiguration.name = this.deviceDefinition.title;
    this.productConfiguration.formBuilder = this.fb;
    this.productConfiguration.deviceId = this.deviceId;
    if (this.configId !== 0) {
      this.productConfiguration.id = this.configId;
    }
  }

  // Enregistre la configuration auprès du back office avant la sortie du composant
  saveConfigurationToBackOffice(): Observable<boolean> {
    return new Observable((observer) => {
      this.productConfiguration.description = this.project.configurationDescription;
      this.productConfiguration.favorites = this.project.configurationIsFavorite;
      this.productConfiguration.title = this.project.configurationName;
      this.productConfiguration.configuration = this.project.project; // La configuration au format Angular, ce qui correspond au contenu du projet
      this.productConfiguration.deviceConfiguration = JSON.parse(this.project.getRegistersConfigurationForDeviceAndTemplates());
      this.asyncOperation = true;
      if (this.project.id !== 0) {
        this.productConfiguration.id = this.project.id;
      }

      this.productConfiguration.saveConfiguration().subscribe({
        next: (response: IConfigurationToSaveResponse) => {
          this.productConfiguration.id = response.id;
          if (this.project.id === 0) {
            this.project.id = response.id;
            this.project.save();
          }
          this.asyncOperation = false;
          this.snackBar.open($localize`Configuration saved with success`, $localize`Success`, {
            duration: 4000,
          });
          observer.next(true);
        },
        error: (error: HttpErrorResponse) => {
          this.asyncOperation = false;
          const title = $localize`Error during a network request`;
          const message = $localize`There was an error while saving your configuration:` + '\n\n' + error.message;
          console.error(title, message);
          console.error(error);
          this.snackBar.open($localize`Error while saving the configuration`, $localize`Error`, {
            duration: 4000,
          });
          observer.error(false);
        },
      });
    });
  }

  // Permet de ne pas changer de route sans enregister la configuration
  // @ts-ignore
  isDirty(currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
    if (this.configurationForm.pristine) {
      // On n'a rien modifié sur le formulaire
      return true;
    }
    if (!this.pageOrAppQuitService.needConfirmationBeforeToLeaveConfiguration(nextState)) {
      // Ce n'est pas une page qui ne concerne pas la configuration donc on sauvegarde sans rien demander
      return this.saveConfigurationToBackOffice();
    }

    // C'est une page qui ne concerne pas la configuration, on va devoir chaîner sur une confirmation de sortie ET une demande d'enregistement
    return new Observable<boolean>((observer) => {
      this.dialogsService
        .yesNo(
          $localize`Warning`,
          $localize`You are going to leave the configuration, Do you really want to do it?`,
          $localize`Leave without saving`,
          $localize`Back to Edit screen`,
        )
        .subscribe({
          next: (response: boolean) => {
            if (response === false) {
              observer.next(false);
              observer.complete();
            } else {
              // L'utilisateur veut sortir
              // On enchaîne sur la demande de sauvegarde
              this.dialogsService.yesNo($localize`Save data`, $localize`Do you want to save your configuration?`).subscribe({
                next: (saveDataResponse: boolean) => {
                  if (saveDataResponse === false) {
                    observer.next(true);
                    observer.complete();
                  } else {
                    this.saveConfigurationToBackOffice().subscribe(
                      () => {
                        observer.next(true);
                        observer.complete();
                      },
                      () => {
                        observer.next(true);
                        observer.error(false);
                      },
                    );
                  }
                },
                error: () => {
                  observer.next(true);
                  observer.complete();
                },
              });
            }
          },
          error: () => {
            observer.next(false);
            observer.error();
          },
        });
    });
  }

  // Retourne les paramètres de la requête à eventuellement mettre en place si on est en mode readonly
  private getQueryParameters(): object {
    let queryParameters = {};
    if (this.isInReadOnlyMode) {
      queryParameters = { readonly: true };
    }
    return queryParameters;
  }

  // navigation vers l'écran qui permet d'enregistrer la configuration et de l'appliquer à un périphérique
  gotoSaveWriteComponent() {
    if (this.isConfigurationFormValid()) {
      this.router.navigate(['/savewrite', this.deviceId, this.configId, this.childComponentName, this.uuid], {
        queryParams: this.getQueryParameters(),
      });
    }
  }

  /**
   * Permet de récupérer un objet Device depuis DeviceInformationsComponent
   * qui est en charge de récupérer les périphériques passés dans les routes.
   * Cette méthode est appelée par ce composant via la création d'un évènement.
   */
  getDeviceFromComponent(device: Device) {
    this.currentDevice = device;
  }

  /**
   * Méthode appelée par DeviceInformationsComponent (en charge de récupérer
   * les devices passés dans les routes), lorsque le téléchargement du
   * périphérique à échoué.
   */
  deviceLoadFailed() {
    this.snackBar.open($localize`It was not possible to get the selected device`, $localize`Error`, {
      duration: 4000,
    });
    this.goHome();
  }

  // A chaque changement **valide** du formulaire de configuration on ajuste la présence du bouton des templates
  getConfigurationFormChangesNotifications() {
    //this.setFormStatus();
    this.configurationFormChanges = this.formsUtilsService.formChangesSubscriber$.subscribe(() => {
      this.hasBleTemplates = this.deviceRegistersConfiguration.deviceHasBle(this.deviceDefinition);
      this.hasNfcTemplates = this.deviceRegistersConfiguration.isDeviceInReaderMode(this.deviceDefinition);
      this.setTopButtons();
    });
  }

  // Retourne la valeur d'un champ
  fieldValue(fieldName: string): any {
    return getFieldValue(this.configurationForm, fieldName);
  }

  // Est-ce que l'écran courant de configuration est valide ?
  isConfigurationFormValid(): boolean {
    if (this.configurationForm.invalid) {
      this.dialogsService
        .showOkMessage($localize`Device Error`, $localize`The content of the form is invalid, please correct it.`)
        .subscribe({
          next: () => {},
        });
      return false;
    }
    return true;
  }

  // Affiche l'écran permettant de configurer les templates
  showTemplatesScreen() {
    if (!this.isConfigurationFormValid()) {
      this.formsUtilsService.setFocusToFirstFieldWithError();
      return;
    }
    if (
      !this.deviceRegistersConfiguration.deviceHasBle(this.deviceDefinition) &&
      !this.deviceRegistersConfiguration.isDeviceInReaderMode(this.deviceDefinition)
    ) {
      this.dialogsService
        .showOkMessage($localize`Templates`, $localize`According to the configuration, the device does not use templates.`)
        .subscribe({
          next: () => {},
        });
      return;
    }
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['/templates', this.deviceId, this.configId, this.childComponentName, this.uuid], {
      queryParams: this.getQueryParameters(),
    }); //queryParamsHandling: 'merge',
  }

  // Réinitialisation des champs du formulaire à leur valeur initiale
  reset() {
    this.dialogsService
      .yesNoCancel($localize`Warning device reset`, $localize`Do you really want to reset the form's content?`, false)
      .subscribe({
        next: (button) => {
          switch (button) {
            case 'yes':
              this.formsUtilsService.reloadFormInitalValues();
              this.snackBar.open($localize`Form was cleared`, '', {
                duration: 4000,
              });
              break;

            case 'no':
              this.snackBar.open($localize`Form was not cleared`, '', {
                duration: 4000,
              });
              return;
              break;
          }
        },
      });
  }

  // Retour à l'écran d'accueil de l'application, probablement en cas de problème grave
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Création du projet dans la localStorage qui permet de conserver les informations de paramétrage et de configuration.
   * Tous les paramètres de la route sont connus.
   */
  createProject() {
    if (this.uuid === '0') {
      // Création d'un nouveau projet
      this.uuid = Project.getUuid();
    }
    this.project = new Project(this.uuid);
    this.project.deviceId = this.deviceId;
    this.project.componentName = this.childComponentName;

    if (this.initialUuid === '0') {
      // Création d'un nouveau projet
      this.project.save();
    } else {
      if (!this.project.load()) {
        this.dialogsService.showOkMessage($localize`Error`, `It was not possible to load the projet, consult the console`).subscribe({
          next: () => {},
        });
        this.goHome();
        return;
      }
    }

    // Pour afficher, dans la barre d'info du haut de la page, le nom de la configuration
    this.configurationName = this.project.configurationName;
  }

  // Place les données de configuration qui se trouvent dans le projet dans le formulaire de configuration du lecteur
  setProjectConfigurationIntoConfigurationForm(): void {
    // Retourne un objet de type IProjectComponentConfiguration ou null
    const componentConfiguration = this.project.getComponentConfiguration(this.childComponentName, -1);
    if (componentConfiguration !== null) {
      this.deviceRegistersConfiguration.setFormContent(
        JSON.parse(componentConfiguration.form),
        JSON.parse(componentConfiguration.registers),
      );
      // Mise en place des données de configuration dans le formulaire
      this.formsUtilsService.saveFormInitialValues(this.configurationForm);
    }
  }

  // Mise en place des données d'une configuration téléchargée depuis le back office
  setLoadedConfiguration(loadedConfiguration: IConfigurationDetails) {
    // 1) Chargement du projet
    const projectConfiguration: IProject = JSON.parse(loadedConfiguration.configuration); // Le contenu du projet au format JSON sérialisé
    this.project.createProjectFromLoadedConfiguration(projectConfiguration);
    if (loadedConfiguration.description) {
      this.project.configurationDescription = loadedConfiguration.description;
    }
    this.project.configurationIsFavorite = loadedConfiguration.favorites;
    this.project.configurationName = loadedConfiguration.title;
    this.project.id = loadedConfiguration.id;
    this.project.save();
    this.configurationName = loadedConfiguration.title;

    // 2) Mise en place des données dans le formulaire
    this.setProjectConfigurationIntoConfigurationForm();
    this.configId = 0; // Pour que lorsqu'on change d'écran on ne recharge pas à nouveau cette configuration
  }

  // Charge une configuration existante de l'utilisateur, si on en a spécifié une sur l'url
  loadExistingConfigurationFromServer() {
    this.downloadingConfiguration = true;
    this.configurationsService.getConfiguration(this.configId).subscribe({
      next: (configuration: IConfigurationDetails) => {
        // On reçoit du back office l'enregistrement complet de la table configurations
        this.setLoadedConfiguration(configuration);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while loading an existing user configuration', this.configId);
        console.error(error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while loading your configuration:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.loadExistingConfigurationFromServer();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
      complete: () => (this.downloadingConfiguration = false),
    });
  }

  // Ouvre une boîte de dialogue qui permet de changer les paramètres de la configuration
  editConfigurationFormSettings() {
    const formSettings: IConfigurationFormSettings = {
      title: this.project.configurationName,
      description: this.project.configurationDescription,
      isFavorite: this.project.configurationIsFavorite,
    };
    this.dialogsService.setConfigurationFormSettings(formSettings).subscribe({
      next: (answer: IConfigurationFormSettingsAnswer) => {
        if (answer.okClicked) {
          this.project.configurationName = answer.title;
          this.project.configurationDescription = '';
          if (answer.description) {
            this.project.configurationDescription = answer.description;
          }
          this.project.configurationIsFavorite = answer.isFavorite;
          this.project.save();
          this.configurationName = answer.title;
        } else {
          this.snackBar.open($localize`Configuration settings were not changed`, $localize`Warning`, {
            duration: 4000,
          });
        }
      },
    });
  }

  // Met en place et gère les clics sur les boutons du haut de page
  manageDeviceButtonsClicks() {
    this.buttonsSubscription = this.deviceInformationsButtonsService.subscriber$.subscribe((buttonId) => {
      switch (buttonId) {
        case 'btnSave':
          this.gotoSaveWriteComponent();
          break;

        case 'btnEditMode': // On passe du mode 'visu' au mode édition
          this.isInReadOnlyMode = false;
          this.configurationForm.enable();
          this.configurationForm = new UntypedFormGroup(this.configurationFormControls);
          break;

        case 'btnReset':
          this.reset();
          break;

        case 'btnTemplates':
          this.showTemplatesScreen();
          break;

        case 'configurationEdit':
          if (!this.isInReadOnlyMode) {
            this.editConfigurationFormSettings();
          }
          break;
      }
    });
  }

  // Switch advanced mode
  setAdvancedMode() {
    this.deviceInformationsButtonsService.advanced$.subscribe((isAdvanced : boolean) => {
      this.advanced = isAdvanced;
    })
  }
}

