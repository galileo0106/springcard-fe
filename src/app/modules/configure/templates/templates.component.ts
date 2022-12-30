import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { Devices } from '@shared/classes/Devices';
import { ProductConfiguration } from '@shared/classes/ProductConfiguration';
import { Project } from '@shared/classes/Project';
import { TemplatesList } from '@shared/configurations/templatesList';
import { IConfigurationToSaveResponse } from '@shared/models/Configuration/configurations.to.save.response.model';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { IConfigurationFormSettingsAnswer } from '@shared/models/Configuration/iconfiguration.form.settings.answer.interface';
import { IConfigurationFormSettings } from '@shared/models/Configuration/iconfiguration.form.settings.interface';
import { ITemplatesList } from '@shared/models/Device/ideviceslist.model';
import { ITemplatesTypeSlot } from '@shared/models/ITemplates.type.slot.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { IIsDirty } from '@shared/services/can-deactivate-guard.service';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FormsUtilsService } from '@shared/services/forms-utils.service';
import { PageOrAppQuitService } from '@shared/services/page-or-app-quit.service';
import { Observable, Subscription } from 'rxjs';
import { environment } from './../../../../environments/environment';

/**
 * Ecran qui regroupe la liste des templates et permet de les configurer
 */
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css'],
})
export class TemplatesComponent implements OnInit, OnDestroy, IIsDirty {
  deviceDefinition: IDeviceList; // Le périphérique courant tel qu'on peut le trouver dans shared\configurations\devicesList.ts
  templatesList: ITemplatesList[] = TemplatesList;
  nfcTemplatesList: ITemplatesList[] = [];
  bleTemplatesList: ITemplatesList[] = [];
  selectedTemplateList: ITemplatesList[] = [];
  nfcTemplatesRange: number[] = [];
  bleTemplatesRange: number[] = [];
  templateForm: UntypedFormGroup; // Formulaire qui contient la liste des templates en fonction du type et du slot du template
  templateDescription = '';
  asyncOperation = false;
  selectedTemplateId = '';
  selectedTemplateTitle = '';
  selectedTemplateType = ''; // @todo, supprimer ?
  currentSelectedTemplateTitle = '';
  selectedTemplateSlot = 0;
  nfcTemplatesCount = 0;
  bleTemplatesCount = 0;
  currentTab = 0;
  buttonsSubscription: Subscription;
  configurationName = '';
  public isInReadOnlyMode = false;
  productConfiguration: ProductConfiguration; // La classe qui permet de sauvegarder la configuration dans le back office

  // Liste de tous les types et slots
  // templatesTypes[0] = {type: 'nfc', slot: 0 }
  // templatesTypes[1] = {type: 'nfc', slot: 1 }
  // templatesTypes[3] = {type: 'nfc', slot: 3 }
  // templatesTypes[4] = {type: 'ble', slot: 0 }
  templatesTypes: ITemplatesTypeSlot[] = [];
  templateType = '';
  topButtons = Array<ITopButton>();
  project: Project;
  templateSlot = 0; // Le slot du template sur lequel on est positionné dans les onglets des templates

  // Les paramètres reçus dans l'URL
  deviceId = '0';
  componentName = ''; // Le nom du composant du périphérique
  configId = 0; // Le numéro de la configuration depuis le back office
  uuid = '';

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = confirm($localize`You are going to leave configuration, please confirm it.`);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public app: ApplicationService,
    public configurationsService: ConfigurationsService,
    public formsUtilsService: FormsUtilsService,
    public dialogsService: DialogsService,
    public snackBar: MatSnackBar,
    public deviceInformationsButtonsService: DeviceInformationsButtonsService,
    private pageOrAppQuitService: PageOrAppQuitService,
    public fb: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.templatesButtonsClicks();
    this.nfcTemplatesCount = environment.nfcTemplatesCount;
    this.bleTemplatesCount = environment.bleTemplatesCount;

    this.searchQueryParameters();
    this.setTopButton();
    this.createTemplatesLists();
    this.createFormsObjects();
    this.setTemplateInTab(0);
    this.createProductConfiguration();
  }

  // Instanciation de la classe productConfiguration avec les bons paramètres
  createProductConfiguration() {
    this.productConfiguration = new ProductConfiguration(this.configurationsService);
    this.productConfiguration.firmware = this.deviceDefinition.firmware;
    this.productConfiguration.hardware = this.deviceDefinition.hardware;
    this.productConfiguration.name = this.deviceDefinition.title;
    this.productConfiguration.formBuilder = this.fb;
    this.productConfiguration.deviceId = this.deviceId;
  }

  // Enregistre la configuration auprès du back office avant la sortie du composant
  saveConfigurationToBackOffice(): Observable<boolean> {
    return new Observable((observer) => {
      this.productConfiguration.description = this.project.configurationDescription;
      this.productConfiguration.favorites = this.project.configurationIsFavorite;
      this.productConfiguration.title = this.project.configurationName;
      this.productConfiguration.configuration = this.project.project; // La configuration au format Angular, ce qui correspond au contenu du projet
      this.productConfiguration.deviceConfiguration = JSON.parse(this.project.getRegistersConfigurationForDeviceAndTemplates());
      if (this.project.id !== 0) {
        this.productConfiguration.id = this.project.id;
      }
      this.asyncOperation = true;

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

  // Création du formulaire qui permet de choisir le type de template et le template
  createFormsObjects() {
    this.templateForm = new UntypedFormGroup({
      template: new UntypedFormControl({ value: '', disabled: false }, [Validators.required]),
    });
  }

  // Création des listes qui contiennent les templates en fonction de leur type (BLE / NFC)
  createTemplatesLists() {
    // Tri des templates sur le titre
    this.templatesList.sort((a, b) => {
      if (a.title.trim().toLowerCase() > b.title.trim().toLowerCase()) {
        return 1;
      }
      if (a.title.trim().toLowerCase() < b.title.trim().toLowerCase()) {
        return -1;
      }
      return 0;
    });

    // Création des types et des slots de templates
    if (this.deviceDefinition.templatesNfc) {
      for (let i = 0; i < this.nfcTemplatesCount; i++) {
        this.nfcTemplatesRange.push(i);
        this.templatesTypes.push({ type: 'nfc', slot: i });
      }
    }

    if (this.deviceDefinition.templatesBle) {
      for (let i = 0; i < this.bleTemplatesCount; i++) {
        this.bleTemplatesRange.push(i);
        this.templatesTypes.push({ type: 'ble', slot: i });
      }
    }

    // Filtre des templates
    this.nfcTemplatesList = this.templatesList.filter((element) => {
      return element.isBleTemplate === false;
    });

    this.bleTemplatesList = this.templatesList.filter((element) => {
      return element.isBleTemplate === true;
    });
  }

  createProject() {
    // On n'a pas reçu d'UUID sur l'url...
    if (this.uuid === '0') {
      this.dialogsService.showOkMessage($localize`Error`, `Can't find the project UUID`).subscribe({
        next: () => {
          this.goHome();
        },
      });
    }
    this.project = new Project(this.uuid);
    if (!this.project.load()) {
      this.dialogsService.showOkMessage($localize`Error`, `It was not possible to load the projet, consult the console`).subscribe({
        next: () => {},
      });
      this.goHome();
      return;
    }
    this.configurationName = this.project.configurationName;
  }

  // Recherche de tous les paramètres attendus dans l'URL
  searchQueryParameters() {
    // Est-ce qu'on est en mode read-only ?
    this.isInReadOnlyMode = this.route.snapshot.queryParams['readonly'];

    // prettier-ignore
    this.deviceId = this.route.snapshot.paramMap.get('deviceId') != null ? (this.route.snapshot.paramMap.get('deviceId') as string) : '0';

    // prettier-ignore
    this.configId = this.route.snapshot.paramMap.get('configId') != null ? parseInt(this.route.snapshot.paramMap.get('configId') as string, 10) : 0;

    // prettier-ignore
    this.uuid = this.route.snapshot.paramMap.get('uuid') != null ? (this.route.snapshot.paramMap.get('uuid') as string) : '0';
    // prettier-ignore
    this.componentName = this.route.snapshot.paramMap.get('componentName') != null ? (this.route.snapshot.paramMap.get('componentName') as string) : '';
    this.searchDeviceFromDeviceListWithComponentName();
    this.createProject();
  }

  // Mise en place des boutons du haut de l'écran
  setTopButton() {
    this.topButtons = [
      {
        label: $localize`Apply to device`,
        color: 'warn',
        type: 'raised-icon-with-text',
        icon: 'save_alt',
        id: 'btnSave',
      },
      {
        label: $localize`Settings`,
        color: 'warn',
        type: 'raised-icon-with-text',
        icon: 'developer_board',
        id: 'btnBackToDevice',
      },
    ];

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

  // Retourne les paramètres de la requête à eventuellement mettre en place si on est en mode readonly
  private getQueryParameters(): object {
    let queryParameters = {};
    if (this.isInReadOnlyMode) {
      queryParameters = { readonly: true };
    }
    return queryParameters;
  }

  goBackToDevice() {
    // @todo, implémenter le dirty
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['/' + this.componentName, this.deviceId, this.configId, this.uuid], { queryParams: this.getQueryParameters() }); //queryParamsHandling: 'merge',
  }

  ngOnDestroy() {
    if (this.buttonsSubscription) {
      this.buttonsSubscription.unsubscribe();
    }
    this.isInReadOnlyMode = false;
    this.templateForm.enable();
  }

  // Est-ce que le projet courant à un template d'un certain type dans un slot particulier ?
  hasTemplateOfTypeInSlot(type: string, slot: number): boolean {
    return this.project.hasTemplateOfTypeInSlot(type, slot);
  }

  // Ajoute un template (d'un certain type) à un slot donné
  addTemplateType(slot: number, type: string) {
    // Rechargement du projet qui a pu être modifié par un composant de Template
    this.project.load();
    this.templateDescription = '';
    this.selectedTemplateSlot = slot;
    this.templateType = type;
    if (this.templateType.startsWith('nfc')) {
      this.selectedTemplateList = this.nfcTemplatesList; // La liste des templates possibles en NFC
    } else {
      this.selectedTemplateList = this.bleTemplatesList; // La liste des templates possibles en BLE
    }
  }

  // Permet de réagir en fonction de l'onglet sélectionné par l'utilisateur
  setTemplateInTab(tabIndex: number): void {
    this.currentTab = tabIndex;
    const templateType = this.templatesTypes[tabIndex];
    this.currentSelectedTemplateTitle = '';
    if (this.project.hasTemplateOfTypeInSlot(templateType.type, templateType.slot)) {
      const templateComponentName = this.project.getTemplateComponentNameFromSlotAndType(templateType.slot, templateType.type);
      if (templateComponentName !== null) {
        // On va faire apparaître le bon composant de template
        const templateId = this.findTemplateIdFromComponentName(templateComponentName);
        this.selectedTemplateId = templateId;
        this.templateSlot = templateType.slot;
        this.currentSelectedTemplateTitle = this.findTemplateTitleFromComponentName(templateComponentName);
      }
    } else {
      this.selectedTemplateId = '';
      this.templateSlot = tabIndex;
      //this.selectedTemplateSlot = tabIndex;
    }
  }

  // Appelé par le template quand on clic sur un onglet
  tabChanged($event: MatTabChangeEvent) {
    const tabIndex = $event.index;
    this.setTemplateInTab(tabIndex);
  }

  // Quand l'utilisateur a validé l'utilisation d'un template, par exemple `ID Only`
  useTemplate() {
    this.selectedTemplateId = '';
    this.selectedTemplateType = '';
    this.selectedTemplateTitle = '';
    this.selectedTemplateId = getFieldValue(this.templateForm, 'template');
    // Ajout du template au projet
    const templateComponentName = this.findTemplateComponentFromTemplateId(this.selectedTemplateId);
    if (templateComponentName !== '') {
      this.project.setTemplateFromSlotAndType(templateComponentName, this.selectedTemplateSlot, this.templateType);
      this.project.save();
    }
    this.selectedTemplateSlot = -1;

    // Recherche du titre du template pour affichage
    for (const template of this.templatesList) {
      if (this.selectedTemplateId === template.id) {
        this.selectedTemplateTitle = template.title;
      }
    }
    this.selectedTemplateType = this.templateType === 'nfc' ? 'NFC' : 'Bluetooth Low Energy';
  }

  // Quand une sélection dans la liste déroulante qui contient les templates à été faite
  modelChanged() {
    this.templateDescription = '';
    const templateId = getFieldValue(this.templateForm, 'template');
    if (templateId) {
      let listToSearchIn = this.nfcTemplatesList;
      if (this.templateType === 'ble') {
        listToSearchIn = this.bleTemplatesList;
      }
      for (const template of listToSearchIn) {
        if (template.id === templateId) {
          this.templateDescription = template.description;
        }
      }
    }
  }

  // Annule l'ajout d'un template dans un slot
  cancelAddTemplate() {
    this.selectedTemplateSlot = 0;
    this.templateDescription = '';
    this.templateType = '';
  }

  // Recherche, à partir du nom du composant reçu dans l'url, de la définition du péripéhrique sur lequel on travaille
  searchDeviceFromDeviceListWithComponentName() {
    const devices = new Devices();
    const deviceItem: IDeviceList | null = devices.getDeviceFromComponent(this.componentName);
    if (deviceItem !== null) {
      this.deviceDefinition = deviceItem;
      return;
    }
    this.dialogsService
      .showOkMessage($localize`Error`, `we were not able to find the type of device you are trying to configure.`)
      .subscribe({
        next: () => {
          this.goHome();
        },
      });
  }

  // Supprime un template, et sa configuration, d'un slot
  removeTemplateTypeInSlot(type: string, slot: number) {
    // Rechargement du projet qui a pu être modifié par un composant de Template
    this.project.load();
    this.dialogsService
      .yesNoCancel($localize`Warning`, $localize`Do you really want to remove this template, its content will be lost?`, false)
      .subscribe({
        next: (button) => {
          switch (button) {
            case 'yes':
              if (type.trim().toLowerCase() === 'nfc') {
                this.project.removeNfcTemplateFromSlot(slot);
              } else {
                this.project.removeBleTemplateFromSlot(slot);
              }
              this.project.save();
              this.selectedTemplateId = '';
              this.templateSlot = -1;
              this.snackBar.open($localize`Template was removed`, '', {
                duration: 4000,
              });
              break;

            case 'no':
              this.snackBar.open($localize`Template was not removed`, '', {
                duration: 4000,
              });
              return;
              break;
          }
        },
      });
  }

  // Recherche, dans TemplatesList, l'ID d'un composant de template à partir du nom de son composant
  findTemplateIdFromComponentName(componentName: string): string {
    for (const templateType of this.templatesList) {
      if (templateType.component.trim().toLowerCase() === componentName.trim().toLowerCase()) {
        return templateType.id;
      }
    }
    return '';
  }

  // Recherche du titre du template à partir du nom de son composant
  findTemplateTitleFromComponentName(componentName: string): string {
    for (const templateType of this.templatesList) {
      if (templateType.component.trim().toLowerCase() === componentName.trim().toLowerCase()) {
        return templateType.title;
      }
    }
    return '';
  }

  // Recherche, dans TemplatesList, le nom du composant d'un template à partir de son ID
  findTemplateComponentFromTemplateId(templateId: string): string {
    for (const templateType of this.templatesList) {
      if (templateType.id.trim().toLowerCase() === templateId.trim().toLowerCase()) {
        return templateType.component;
      }
    }
    return '';
  }

  // Permet de ne pas aller vers une autre route sans avoir sauvegardé
  // @ts-ignore
  isDirty(currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
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

  // Permet d'aller au dernier écran, celui qui permet d'appliquer la configuration
  goToSaveConfiguration() {
    this.router.navigate(['/savewrite', this.deviceId, this.configId, this.componentName, this.uuid], {
      queryParams: this.getQueryParameters(),
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

  // Gère les clics sur les boutons présents en haut de page (tous les boutons sont gérés par le composant DeviceInformationsComponent)
  templatesButtonsClicks() {
    this.buttonsSubscription = this.deviceInformationsButtonsService.subscriber$.subscribe((buttonId) => {
      switch (buttonId) {
        case 'btnSave':
          //if (!this.project.hasTemplateOfAnyType()) { // @todo, pourquoi ce test ?
          this.goToSaveConfiguration();
          //}
          break;

        case 'btnBackToDevice':
          this.goBackToDevice();
          break;

        case 'btnEditMode': // @todohth
          this.isInReadOnlyMode = false;
          this.templateForm.enable();
          this.setTopButton();
          break;

        case 'configurationEdit':
          this.editConfigurationFormSettings();
          break;
      }
    });
  }

  // Retour à l'écran d'accueil de l'application, probablement en cas de problème grave
  goHome(): void {
    this.router.navigate(['/']);
  }
}
