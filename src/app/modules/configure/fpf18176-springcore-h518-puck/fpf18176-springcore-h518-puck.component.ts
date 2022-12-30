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
import { Fpf18176SpringcoreH518Puck_FieldsDefinition } from './fpf18176-springcore-h518-puck-fields-definition';
import { Fpf18176SpringcoreH518Puck_getFieldsList } from './fpf18176-springcore-h518-puck-fields-list';
import { Fpf18176_springcore_h518_puckFormGroup } from './fpf18176-springcore-h518-puck-form-group';

@Component({
  selector: 'app-fpf18176-springcore-h518-puck',
  templateUrl: './fpf18176-springcore-h518-puck.component.html',
  styleUrls: ['../sharedstyles.css'],
})
export class Fpf18176SpringcoreH518PuckComponent extends DeviceComponent implements OnInit, OnDestroy {

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
    this.setChildComponentName('Fpf18176SpringcoreH518PuckComponent');
    this.valdemortConfig.displayMode = DisplayMode.ONE;
    this.valdemortConfig.shouldDisplayErrors = () => true;
    this.currentTitleService.changeTitle('Configuration - Puck Blue');
    this.setDeviceInformation('springcore/h518/puck', 'FPF18176', "Puck Blue");
    this.searchRouteParameters(); // doit se trouver AVANT this.createConfigurationObjects() - permet la création du projet
    // prettier-ignore
    this.createConfigurationObjects(Fpf18176_springcore_h518_puckFormGroup, Fpf18176SpringcoreH518Puck_FieldsDefinition, Fpf18176SpringcoreH518Puck_getFieldsList);
    this.searchCurrentDeviceInDevicesList();
    this.createProductConfiguration();
    //this.loadConfigurations();
    this.setTopButtons();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
