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
import { Ean18090SpringcoreE518Reference_FieldsDefinition } from './ean18090-springcore-e518-reference-fields-definition';
import { Ean18090SpringcoreE518Reference_getFieldsList } from './ean18090-springcore-e518-reference-fields-list';
import { Ean18090_springcore_e518_referenceFormGroup } from './ean18090-springcore-e518-reference-form-group';

@Component({
  selector: 'app-ean18090-springcore-e518-reference',
  templateUrl: './ean18090-springcore-e518-reference.component.html',
  styleUrls: ['../sharedstyles.css'],
})
export class Ean18090SpringcoreE518ReferenceComponent extends DeviceComponent implements OnInit, OnDestroy {

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
    this.setChildComponentName('Ean18090SpringcoreE518ReferenceComponent');
    this.valdemortConfig.displayMode = DisplayMode.ONE;
    this.valdemortConfig.shouldDisplayErrors = () => true;
    this.currentTitleService.changeTitle('Configuration - Evaluation kit Net');
    this.setDeviceInformation('springcore/e518/reference', 'EAN18090', "Evaluation kit Net");
    this.searchRouteParameters(); // doit se trouver AVANT this.createConfigurationObjects() - permet la création du projet
    // prettier-ignore
    this.createConfigurationObjects(Ean18090_springcore_e518_referenceFormGroup, Ean18090SpringcoreE518Reference_FieldsDefinition, Ean18090SpringcoreE518Reference_getFieldsList);
    this.searchCurrentDeviceInDevicesList();
    this.createProductConfiguration();
    //this.loadConfigurations();
    this.setTopButtons();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
