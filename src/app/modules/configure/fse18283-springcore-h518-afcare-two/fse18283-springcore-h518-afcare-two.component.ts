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
import { Fse18283SpringcoreH518Afcare_two_FieldsDefinition } from './fse18283-springcore-h518-afcare-two-fields-definition';
import { Fse18283SpringcoreH518Afcare_two_getFieldsList } from './fse18283-springcore-h518-afcare-two-fields-list';
import { Fse18283_springcore_h518_afcare_twoFormGroup } from './fse18283-springcore-h518-afcare-two-form-group';

@Component({
  selector: 'app-fse18283-springcore-h518-afcare-two',
  templateUrl: './fse18283-springcore-h518-afcare-two.component.html',
  styleUrls: ['../sharedstyles.css'],
})
export class Fse18283SpringcoreH518Afcare_twoComponent extends DeviceComponent implements OnInit, OnDestroy {

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
    this.setChildComponentName('Fse18283SpringcoreH518Afcare_twoComponent');
    this.valdemortConfig.displayMode = DisplayMode.ONE;
    this.valdemortConfig.shouldDisplayErrors = () => true;
    this.currentTitleService.changeTitle('Configuration - AFCare Two');
    this.setDeviceInformation('springcore/h518/afcare-two', 'FSE18283', "AFCare Two");
    this.searchRouteParameters(); // doit se trouver AVANT this.createConfigurationObjects() - permet la création du projet
    // prettier-ignore
    this.createConfigurationObjects(Fse18283_springcore_h518_afcare_twoFormGroup, Fse18283SpringcoreH518Afcare_two_FieldsDefinition, Fse18283SpringcoreH518Afcare_two_getFieldsList);
    this.searchCurrentDeviceInDevicesList();
    this.createProductConfiguration();
    //this.loadConfigurations();
    this.setTopButtons();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
