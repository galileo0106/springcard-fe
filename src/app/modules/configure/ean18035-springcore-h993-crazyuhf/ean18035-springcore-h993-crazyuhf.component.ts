import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FormsUtilsService } from '@shared/services/forms-utils.service';
import { PageOrAppQuitService } from '@shared/services/page-or-app-quit.service';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';
import { DeviceComponent } from '../device/device.component';
import { Ean18035SpringcoreH993Crazyuhf_FieldsDefinition } from './ean18035-springcore-h993-crazyuhf-fields-definition';
import { Ean18035SpringcoreH993Crazyuhf_getFieldsList } from './ean18035-springcore-h993-crazyuhf-fields-list';
import { Ean18035_springcore_h993_crazyuhfFormGroup } from './ean18035-springcore-h993-crazyuhf-form-group';

@Component({
  selector: 'app-ean18035-springcore-h993-crazyuhf',
  templateUrl: './ean18035-springcore-h993-crazyuhf.component.html',
  styleUrls: ['../sharedstyles.css'],
})
export class Ean18035SpringcoreH993CrazyuhfComponent extends DeviceComponent implements OnInit, OnDestroy {

  constructor(
    public currentTitleService: CurrentTitleService,
    public fb: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public dialogsService: DialogsService,
    public snackBar: MatSnackBar,
    public configurationsService: ConfigurationsService,
    public router: Router,
    public app: ApplicationService,
    public valdemortConfig: ValdemortConfig,
    public elementRef: ElementRef,
    public formsUtilsService: FormsUtilsService,
    public deviceInformationsButtonsService: DeviceInformationsButtonsService,
    public pageOrAppQuitService: PageOrAppQuitService,
  ) {
    super(formsUtilsService, dialogsService, snackBar, elementRef, configurationsService, activatedRoute, app, router, deviceInformationsButtonsService, pageOrAppQuitService, fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setChildComponentName('Ean18035SpringcoreH993CrazyuhfComponent');
    this.valdemortConfig.displayMode = DisplayMode.ONE;
    this.valdemortConfig.shouldDisplayErrors = () => true;
    this.currentTitleService.changeTitle('Configuration - Crazy UHF USB');
    this.setDeviceInformation('springcore/h993/crazyuhf', 'EAN18035', "Crazy UHF USB");
    this.searchRouteParameters(); // doit se trouver AVANT this.createConfigurationObjects() - permet la création du projet
    // prettier-ignore
    this.createConfigurationObjects(Ean18035_springcore_h993_crazyuhfFormGroup, Ean18035SpringcoreH993Crazyuhf_FieldsDefinition, Ean18035SpringcoreH993Crazyuhf_getFieldsList);
    this.searchCurrentDeviceInDevicesList();
    this.createProductConfiguration();
    //this.loadConfigurations();
    this.setTopButtons();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
