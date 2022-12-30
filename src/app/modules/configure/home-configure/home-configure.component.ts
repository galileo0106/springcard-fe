import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { Devices } from '@shared/classes/Devices';
import { ProductConfiguration } from '@shared/classes/ProductConfiguration';
import { Project } from '@shared/classes/Project';
import { IConfigurationDetails } from '@shared/models/Configuration/configuration.details.models';
import { IConfigurationList } from '@shared/models/Configuration/configuration.list.model';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { IButtonClick } from '@shared/models/UI/ibuttonclick.model';
import { IDuplicateConfiguration } from '@shared/models/Configuration/iduplicateconfiguration.model';
import { IInputField } from '@shared/models/UI/IinputField.model';
import { IProductsConfigurationList } from '@shared/models/Configuration/IProductsConfigurationList.model';
import { IProject } from '@shared/models/iproject.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { Observable, Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Misc } from '@shared/classes/Misc';

/**
 * Liste de toutes les configurations de l'utilisateur
 */
@Component({
  selector: 'app-home-configure',
  templateUrl: './home-configure.component.html',
  styleUrls: ['./home-configure.component.scss'],
})
export class HomeConfigureComponent implements OnInit, OnDestroy {
  private topButtons = Array<ITopButton>();
  private buttonsClickSubscriber: Subscription;

  filterProductId = null; // -1 = tous les produits
  filterFavorites: boolean | null = null;
  canSendConfigurations = true;
  isSharingConfiguration = false;

  isImporting = false;

  isConnected = false;
  configurationsLoaded = false;
  configurations$: IConfigurationList[] = [];
  private productConfiguration: ProductConfiguration;
  public configurationsDataSource: Observable<any[]>;
  public displayedColumns = ['title', 'description', 'created', 'modified', 'product', 'author', 'actions'];
  filterForm: UntypedFormGroup;
  userProductsList: IProductsConfigurationList[] = [];

  fileContent: string | ArrayBuffer | null = '';

  constructor(
    private currentTitleService: CurrentTitleService,
    private topButtonsService: TopButtonsService,
    private configurationsService: ConfigurationsService,
    private app: ApplicationService,
    private dialogsService: DialogsService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.currentTitleService.changeTitle($localize`Your configurations`);
  }

  ngOnInit() {
    this.productConfiguration = new ProductConfiguration(this.configurationsService);
    this.filterForm = new UntypedFormGroup({
      product: new UntypedFormControl('-1'),
      isFavorite: new UntypedFormControl('all'),
    });
    this.getAllProductsListUsedInConfigurations();
    this.isConnected = this.authService.isLoggedIn();
    this.setTopButtons();
    if (this.isConnected) {
      this.getConfigurationsList();
    }
    this.canSendConfiguration();
  }

  public onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function()  {
      self.fileContent = fileReader.result;
      self.importConfiguration(self.fileContent);
    }
    fileReader.readAsText(file);
  }

  setAdvancedState($event: MatSlideToggleChange) {
    //set advanced state on user's profile
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

  setTopButtons() {
    this.topButtons = [
      {
        label: $localize`Refresh`,
        color: 'warm',
        type: 'icon-button',
        id: 'refreshList',
        icon: 'refresh',
        tooltip: $localize`Refresh now`
      },
    ];

    // Set buttons in the top of the screen
    this.topButtonsService.setTopButtons(this.topButtons);

    // And subscribe to their clicks
    this.buttonsClickSubscriber = this.topButtonsService.buttonsClicks.subscribe((buttonParameters: IButtonClick) => {
      switch (buttonParameters.id) {
        case 'refreshList':
          this.getConfigurationsList();
          break;
      }
    });
  }

  ngOnDestroy() {
    this.buttonsClickSubscriber.unsubscribe();
    this.topButtonsService.removeTopButtons();
  }

  // Retourne la liste de tous les produits uniques utilisés dans les configurations de l'utilisateur
  public getAllProductsListUsedInConfigurations() {
    this.configurationsLoaded = false;
    this.productConfiguration.getProductsConfigurationList().subscribe({
      next: (productsList: IProductsConfigurationList[]) => {
        this.userProductsList = productsList;
      },
      error: (error) => {
        console.error('Error while getting the list of products used in user configurations', error);
        const title = $localize`Error during a network request`;
        const message =
          $localize`There was an error while asking for the list of the products used in your configurations:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getAllProductsListUsedInConfigurations();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    });
  }

  // Mise en place d'un filtre sur les données
  public filterField(name: string) {
    if (name.trim().toLowerCase() === 'product') {
      const productId = getFieldValue(this.filterForm, 'product');
      if (!productId) {
        return;
      }
      this.filterProductId = productId === -1 ? null : productId;
    } else if (name.trim().toLowerCase() === 'isfavorite') {
      const fav = getFieldValue(this.filterForm, 'isFavorite');
      if (!fav) {
        return;
      }
      switch (fav) {
        case 'all':
          this.filterFavorites = null;
          break;
        case 'true':
          this.filterFavorites = true;
          break;
        case 'false':
          this.filterFavorites = false;
          break;
      }
    }
    this.getConfigurationsList();
  }

  // Charge la liste des configurations avec éventuellement des filtres
  public getConfigurationsList() {
    this.configurationsLoaded = false;
    this.configurationsDataSource = new Observable<any[]>();
    this.configurationsDataSource = this.productConfiguration.getAll(this.filterProductId, this.filterFavorites);
    this.configurationsDataSource.subscribe({
      next: (configurations: IConfigurationList[]) => {
        this.configurations$ = configurations;
      },
      error: (error) => {
        console.error('Error while getting the list of user configurations', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the list of your configurations list:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getConfigurationsList();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
      complete: () => (this.configurationsLoaded = true),
    });
  }

  refresh() {
    this.getConfigurationsList();
  }

  public importConfiguration(configurationContent: string | ArrayBuffer | null) {
    this.isImporting = true;
    this.productConfiguration.importConfiguration(configurationContent).subscribe({
      next: () => {
        this.isImporting = false;
        this.snackBar.open($localize`Configuration imported with success`, $localize`Success`, {
          duration: 4000,
        });
        this.getConfigurationsList();
      },
      error: (error) => {
        // this.isSharingConfiguration = false;
        this.configurationsLoaded = true;
        console.error('Error while sharing your configuration', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while importing your configuration:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.importConfiguration(configurationContent);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    })
  }

  // Partage d'une configuration avec quelqu'un
  shareConfiguration(configurationId: number, recipient: string) {
    this.isSharingConfiguration = true;
    this.productConfiguration.shareConfiguration(configurationId, recipient).subscribe({
      next: () => {
        this.isSharingConfiguration = false;
        this.snackBar.open($localize`Configuration shared with success`, $localize`Success`, {
          duration: 4000,
        });
      },
      error: (error) => {
        this.isSharingConfiguration = false;
        this.configurationsLoaded = true;
        console.error('Error while sharing your configuration', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while sharing your configuration:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.shareConfiguration(configurationId, recipient);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    });
  }

  // Suppression d'une configuration existante
  deleteConfiguration(configurationId: number) {
    this.productConfiguration.deleteConfiguration(configurationId).subscribe({
      next: () => {
        this.snackBar.open($localize`Configuration deleted with success`, $localize`Success`, {
          duration: 4000,
        });
        this.getConfigurationsList();
      },
      error: (error) => {
        this.configurationsLoaded = true;
        console.error('Error while deleting your configuration', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while deleting your configuration:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.deleteConfiguration(configurationId);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    });
  }

  // Change le status de favoris (ou pas) d'une configuration
  favunfav(configurationId: number, favorite: boolean) {
    this.productConfiguration.favUnfavConfiguration(configurationId, favorite).subscribe({
      next: () => {
        this.snackBar.open($localize`Configuration status was changed with success`, $localize`Success`, {
          duration: 4000,
        });
        this.getConfigurationsList();
      },
      error: (error) => {
        this.configurationsLoaded = true;
        console.error('Error while changing the status of your configuration', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while changing the status of your configuration:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.favunfav(configurationId, favorite);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    });
  }

  // On lance l'édition d'une configuration
  editConfiguration(configuration: IConfigurationList, readonly = false) {
    const devices = new Devices();
    const device: IDeviceList | null = devices.getDeviceFromFirmwareAndTitle(configuration.product_firmware, configuration.product_title);
    if (device === null) {
      this.snackBar.open(`The device component can't be found!`, $localize`Error`, {
        duration: 4000,
      });
      return;
    }
    const componentName = device.component;
    let queryParameters = {};
    if (readonly) {
      queryParameters = { readonly: true }; // , t: Math.random()
    }
    this.router.navigate(['/' + componentName, '0', configuration.id, '0'], { queryParams: queryParameters }); // queryParamsHandling: 'merge'
  }

  // Permet d'appliquer une configuration à un lecteur
  applyConfiguration(configurationId: number) {
    // 1) Charger la configuation
    this.productConfiguration.getFromId(configurationId).subscribe({
      next: (configuration: IConfigurationDetails) => {
        console.info($localize`Configuration loaded with success`);
        // 2) Créer un projet
        const projectUuid = Project.getUuid();
        const angularConfiguration = JSON.parse(configuration.configuration) as IProject;
        const componentName = angularConfiguration.component;
        const project = new Project(projectUuid, componentName);
        project.createProjectFromLoadedConfiguration(angularConfiguration);
        project.save();

        // 3) Sauter à l'écran SaveWrite
        // path: 'savewrite/:deviceId/:configId/:componentName/:uuid',
        this.router.navigate(['/savewrite', '0', configurationId, componentName, projectUuid]);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while loading a configuration', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while loading your configuration:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.applyConfiguration(configurationId);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    });
  }

  exportConfiguration(configurationId: number) {
    this.productConfiguration.getFromId(configurationId).subscribe({
      next: (configuration: IConfigurationDetails) => {

        const output: any = {};
        output['type'] = 'multiconf-v2';
        output['title'] = configuration.title;
        output['guid'] = configuration.guid;
        output['description'] = configuration.description;
        output['favorites'] = configuration.favorites;
        output['firmware'] = configuration.product_firmware;
        output['hardware'] = configuration.product_hardware;
        output['name'] = configuration.product_title;
        output['configuration'] = JSON.parse(configuration.configuration);
        output['device_config'] = JSON.parse(configuration.device_configuration);
        const filename = Misc.sanitizeFilename(configuration.title) + '.multiconf.json';
        const content = JSON.stringify(output, null, '    ');
        const element = document.createElement('a');
        const fileType = 'text/json';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(content)}`);
        element.setAttribute('download', filename);
        var event = new MouseEvent('click');
        element.dispatchEvent(event);
        return ;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while downloading a configuration', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while loading your configuration:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.exportConfiguration(configurationId);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },   
    });
  }

  duplicateConfiguration(configurationId: number, title: string, description?: string) {
    this.productConfiguration.duplicateConfiguration(configurationId, title, description).subscribe({
      next: () => {
        this.snackBar.open($localize`Configuration was duplicated with success`, $localize`Success`, {
          duration: 4000,
        });
        this.getConfigurationsList();
      },
      error: (error) => {
        this.configurationsLoaded = true;
        console.error('Error while duplicating your configuration', error);
        const errorTitle = $localize`Error during a network request`;
        const message = $localize`There was an error while duplicating your configuration:` + '\n' + error.message;
        this.dialogsService.retryQuit(errorTitle, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.duplicateConfiguration(configurationId, title, description);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    });
  }

  // Routeur vers les actions sur les configurations
  actionOnConfiguration(configurationId: number, action: string) {
    switch (action.trim().toLowerCase()) {
      case 'view':
        for (const configuration of this.configurations$) {
          if (configuration.id === configurationId) {
            this.editConfiguration(configuration, true);
            return;
          }
        }
        break;

      case 'hash':
        this.snackBar.open($localize`Url was copied to the clipboard`, $localize`Success`, {
          duration: 4000,
        });
        break;

      case 'edit':
        for (const configuration of this.configurations$) {
          if (configuration.id === configurationId) {
            this.editConfiguration(configuration, false);
            return;
          }
        }
        break;

      case 'delete':
        this.dialogsService.yesNo($localize`Remove configuration`, $localize`Do you really want to remove this configuration?`).subscribe({
          next: (button) => {
            if (button === true) {
              this.deleteConfiguration(configurationId);
            }
          },
        });
        break;

      case 'share':
        if (!this.canSendConfigurations) {
          this.shareConfiguration(configurationId, 'support@springcard.com');
          return;
        }
        this.dialogsService
          .inputField(
            $localize`Share configuration`,
            $localize`Enter the mail address of the person to share the configuration with:`,
            $localize`Email`,
            $localize`Ok`,
            $localize`Cancel`,
            'email', // Type de champ
            'question_answer', // Icône
            true, // Est-ce qu'on affiche "Partager avec le support ?"
          )
          .subscribe({
            next: (answer: IInputField) => {
              if (answer.okClicked) {
                this.shareConfiguration(configurationId, answer.answer);
              }
            },
          });
        break;

      case 'duplicate':
        let originalTitle = '';
        let originalDescription = '';
        for (const configuration of this.configurations$) {
          if (configuration.id === configurationId) {
            originalTitle = configuration.title;
            originalDescription = configuration.description;
          }
        }
        this.dialogsService.duplicateConfigurationModal(originalTitle, originalDescription).subscribe({
          next: (answer: IDuplicateConfiguration) => {
            if (answer.okClicked) {
              this.duplicateConfiguration(configurationId, answer.title, answer.description);
            } else {
              this.snackBar.open($localize`Configuration was not duplicated`, $localize`Error`, {
                duration: 4000,
              });
            }
          },
        });
        break;

      case 'apply':
        this.applyConfiguration(configurationId);
        break;
      case 'export':
        this.exportConfiguration(configurationId);
        break;

      case 'favunfav':
        let doFavorite = true;
        for (const configuration of this.configurations$) {
          if (configuration.id === configurationId) {
            doFavorite = !configuration.favorites;
            this.favunfav(configurationId, doFavorite);
            return;
          }
        }
        break;
    }
  }

  // Est-ce que l'utilisateur peut partager une configuration (à quelqu'un d'autre que le support) ?
  canSendConfiguration() {
    this.canSendConfigurations = this.authService.getType() === 2 ? true : false;
  }
}
