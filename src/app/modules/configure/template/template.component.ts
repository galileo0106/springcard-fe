import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { Project } from '@shared/classes/Project';
import { Registers } from '@shared/classes/Registers';
import { TemplatesList } from '@shared/configurations/templatesList';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { ITemplatesList } from '@shared/models/Device/ideviceslist.model';
import { ApplicationService } from '@shared/services/application.service';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FormsUtilsService } from '@shared/services/forms-utils.service';
import { Subscription } from 'rxjs';

/**
 * Classe mère pour tous les composants qui servent à configurer les templates
 * Un template ne peut pas être appelé sans d'abord passer par un composant de périphérique
 */
@Component({
  selector: 'app-template',
  template: ` NO UI! `,
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent implements OnInit, OnDestroy, OnChanges {
  public templatesList: ITemplatesList[] = TemplatesList;

  // Tous les paramètres reçus via les Input() par les classes filles qui étendent cette classe
  _deviceList: IDeviceList; // La définition du **péripéhrique** sur lequel on travaille (à partir de devicesList.ts)
  _componentName = ''; // Nom du composant du **périphérique**
  _deviceId = ''; // Quand on travaille sur un "vrai" périphérique cela correspond à son ID en provenance du service
  _uuid = ''; // L'UUID qui sert à retrouver le projet dans la localStorage
  _configId = 0; // Dans le cas où l'utilisateur a chargé une configuration depuis le backoffice, cela correspond à son ID
  _slot = 0; // Slot dans lequel se trouve le template

  public configurationForm: UntypedFormGroup;
  public asyncOperation = false;
  public deviceRegistersConfiguration: Registers;
  public childComponentName = ''; // Le nom du composant (de template) qui étend cette classe
  public project: Project;
  public templateType = ''; // Contient `nfc` ou `ble` pour indiquer le type de template courant (utilisé dans le projet)
  public templateTypeAsNumber = 0;
  public buttonsSubscription: Subscription;
  public isInReadOnlyMode = false;
  public advanced = false;
  fieldsDefinition: any; // La définition des champs du formulaire au format Reactive Form d'Angular

  constructor(
    public formsUtilsService: FormsUtilsService,
    public dialogsService: DialogsService,
    public snackBar: MatSnackBar,
    public elementRef: ElementRef,
    public configurationsService: ConfigurationsService,
    public activatedRoute: ActivatedRoute,
    public app: ApplicationService,
    public router: Router,
    public deviceInformationsButtonsService: DeviceInformationsButtonsService,
  ) {}

  ngOnInit(): void {
    this.templateButtonsClicks();
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
  }

  // Mis en place pour gérer les changements d'état du formulaire de configuration (readonly ou pas) @todo, ça marche ?
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('configurationIsInReadOnlyMode')) {
      if (!changes.configurationIsInReadOnlyMode.firstChange) {
        this.isInReadOnlyMode = changes.configurationIsInReadOnlyMode.currentValue;
        if (this.isInReadOnlyMode) {
          this.configurationForm.disable();
        } else {
          this.configurationForm.enable();
        }
      }
    }
  }

  // Récupération des paramètres reçus par la classe fille via les @Input()
  // prettier-ignore
  setInputParameters(configId: number, deviceId: string, uuid: string, componentName: string, deviceList: IDeviceList, childComponentName: string, templateType: string, slot: number, configurationIsInReadOnlyMode: boolean) {
    this._configId = configId;
    this._deviceId = deviceId;
    this._uuid = uuid;
    this._slot = slot;
    this._componentName = componentName;
    this._deviceList = deviceList;  // @todo, quelle utilité ?
    this.childComponentName = childComponentName;
    this.templateType = templateType; // Reçoit 'nfc' ou 'ble'
    // 2=nfc, 3=ble
    this.templateTypeAsNumber = this.templateType.trim().toLowerCase() === 'nfc' ? 2 : 3;
    this.isInReadOnlyMode = configurationIsInReadOnlyMode;
    this.loadProject();
  }

  // Permet de ne pas aller vers une autre route sans avoir sauvegardé
  /*isDirty(currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
    if (!this.pageOrAppQuitService.needConfirmationBeforeToLeaveConfiguration(nextState)) {
      return true;
    }
    return this.dialogsService.yesNo('Warning', 'You are going to leave the configuration, Do you really want to do it?', $localize`Leave without saving`, $localize`Back to Edit screen`);
  }*/

  /**
   * Création de l'objet qui contient le formulaire de configuration
   * Sauvegarde des valeurs initiales du formulaire pour faire un reset
   * Début du monitoring du formulaire pour enregistrer les valeurs au fur et à mesure de leur saisie
   * Création de l'objet qui permet de calculer la valeur des registres
   */
  createConfigurationObjects(configFormObject: any, fieldsDefinition: any, fieldsList: any) {
    this.configurationForm = new UntypedFormGroup(configFormObject);
    this.fieldsDefinition = fieldsDefinition;

    this.formsUtilsService.elementRef = this.elementRef;
    this.deviceRegistersConfiguration = new Registers(this.configurationForm, fieldsDefinition, this.templateTypeAsNumber, this._slot + 1);

    // prettier-ignore
    this.formsUtilsService.setWorkingObjects(this.configurationForm, this.project, this.deviceRegistersConfiguration, this.childComponentName, this.templateTypeAsNumber, this._slot);

    // Le callback qui permet d'avoir la liste des champs du formulaire à prendre en compte en fonction des conditions (templates Desfire par exemple)
    this.deviceRegistersConfiguration.setFormFieldsListCallback(fieldsList);

    // 1) On charge les valeurs des champs du formulaire avec les définitions PAR DEFAUT du périphérique
    this.formsUtilsService.createInitialFormValuesFromDefinition(this.configurationForm, this.fieldsDefinition);

    // 2) On récupère la configuration existante depuis le projet
    this.setProjectConfigurationIntoConfigurationForm();

    // On sauvegarde les données initiales du formulaire en cas de reset() de la part de l'utilisateur
    this.formsUtilsService.saveFormInitialValues(this.configurationForm); // Sauvegarde du formgroup avec les valeurs initiales

    // @todo, on a peut être pas besoin de surveiller les changements si on est en mode read-only ?
    this.formsUtilsService.startMonitoringFormToPersist();

    if (this.isInReadOnlyMode) {
      this.configurationForm.disable();
    } else {
      this.configurationForm.enable();
    }
  }

  // Place les données de configuration qui se trouvent dans le projet dans le formulaire de configuration du lecteur
  setProjectConfigurationIntoConfigurationForm(): void {
    const componentConfiguration = this.project.getComponentConfiguration(this.childComponentName, this._slot); // @todo, est-ce que le slot est à changer (par exemple -1) ?
    if (componentConfiguration !== null) {
      this.deviceRegistersConfiguration.setFormContent(
        JSON.parse(componentConfiguration.form),
        JSON.parse(componentConfiguration.registers),
      );
      this.formsUtilsService.saveFormInitialValues(this.configurationForm);
    }
    if (this.isInReadOnlyMode) {
      this.configurationForm.disable();
    } else {
      this.configurationForm.enable();
    }
  }

  // Retourne la valeur d'un champ
  fieldValue(fieldName: string): any {
    return getFieldValue(this.configurationForm, fieldName);
  }

  // Est-ce que l'écran courant de configuration est valide ?
  isConfigurationFormValid(): boolean {
    if (!this.configurationForm) {
      throw new Error('this.configurationForm is not set.... !!???');
    }
    if (this.configurationForm.invalid) {
      this.dialogsService
        .showOkMessage($localize`Template component Error`, $localize`The content of the form is invalid, please correct it`)
        .subscribe({
          next: () => {},
        });
      return false;
    }
    return true;
  }

  // Réinitialisation des champs du formulaire à leur valeur initiale
  reset() {
    this.dialogsService
      .yesNoCancel($localize`Please confirm template reset`, $localize`Do you really want to reset the form's content?`, false)
      .subscribe({
        next: (button) => {
          switch (button) {
            case 'yes':
              this.configurationForm.reset();
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

  // Charge le projet qui a du être crée par le composant du périphérique
  loadProject() {
    this.project = new Project(this._uuid);
    if (!this.project.load()) {
      this.dialogsService
        .showOkMessage($localize`Error`, $localize`It was not possible to load the projet, consult the console`)
        .subscribe({
          next: () => {},
        });
      this.goHome();
      return;
    }
  }

  // Retour à la page d'accueil de l'application en cas de problème grave
  goHome(): void {
    this.router.navigate(['/']);
  }

  // Gère les clics sur les boutons du haut de page
  templateButtonsClicks() {
    this.buttonsSubscription = this.deviceInformationsButtonsService.subscriber$.subscribe((buttonId) => {
      switch (buttonId) {
        case 'btnReset':
          this.reset();
          break;

        /*case 'btnBackToDevice':
          if (this.isConfigurationFormValid()) {
            this.router.navigate(['/' + this._componentName, this._deviceId, this._configId, this._uuid]);
          }
          break;*/
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
