import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FormsUtilsService } from '@shared/services/forms-utils.service';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';
import { TemplateComponent } from '../template/template.component';
import { A78164_FieldsDefinition } from './a-7816-4-fields-definition';
import { A_7816_4_getFieldsList } from './a-7816-4-fields-list';
import { A_7816_4FormGroup } from './a-7816-4-form-group';

@Component({
  selector: 'app-a-7816-4',
  templateUrl: './a-7816-4.component.html',
  styleUrls: ['../sharedstyles.css'],
})
export class A78164Component extends TemplateComponent implements OnInit, OnDestroy {
  @Input() configId = 0;
  @Input() deviceId = '';
  @Input() UUID = '';
  @Input() configurationIsInReadOnlyMode = false;
  @Input() componentName = '';
  @Input() slot = 0;
  @Input() deviceList: IDeviceList;

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
  ) {
    super(formsUtilsService, dialogsService, snackBar, elementRef, configurationsService, activatedRoute, app, router, deviceInformationsButtonsService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.valdemortConfig.displayMode = DisplayMode.ONE;
    this.valdemortConfig.shouldDisplayErrors = () => true;
    this.setInputParameters(this.configId, this.deviceId, this.UUID, this.componentName, this.deviceList, 'A78164Component', 'nfc', this.slot, this.configurationIsInReadOnlyMode);
    this.currentTitleService.changeTitle('Configuration - 7816-4 Template');
    // prettier-ignore
    this.createConfigurationObjects(A_7816_4FormGroup, A78164_FieldsDefinition, A_7816_4_getFieldsList);   }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
