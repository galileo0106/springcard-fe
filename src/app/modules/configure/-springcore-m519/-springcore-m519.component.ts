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
import { SpringcoreM519_FieldsDefinition } from './-springcore-m519-fields-definition';
import { SpringcoreM519_getFieldsList } from './-springcore-m519-fields-list';
import { M519_springcore_m519FormGroup } from './-springcore-m519-form-group';

@Component({
  selector: 'app--springcore-m519',
  templateUrl: './-springcore-m519.component.html',
  styleUrls: ['../sharedstyles.css'],
})
export class SpringcoreM519Component extends DeviceComponent implements OnInit, OnDestroy {

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
    this.setChildComponentName('SpringcoreM519Component');
    this.valdemortConfig.displayMode = DisplayMode.ONE;
    this.valdemortConfig.shouldDisplayErrors = () => true;
    this.currentTitleService.changeTitle('Configuration - M519');
    this.setDeviceInformation('springcore/m519', '', "M519");
    this.searchRouteParameters(); // doit se trouver AVANT this.createConfigurationObjects() - permet la création du projet
    // prettier-ignore
    this.createConfigurationObjects(M519_springcore_m519FormGroup, SpringcoreM519_FieldsDefinition, SpringcoreM519_getFieldsList);
    this.searchCurrentDeviceInDevicesList();
    this.createProductConfiguration();
    //this.loadConfigurations();
    this.setTopButtons();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
