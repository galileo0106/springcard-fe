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
import { IdOnly_FieldsDefinition } from './id-only-fields-definition';
import { Id_only_getFieldsList } from './id-only-fields-list';
import { Id_onlyFormGroup } from './id-only-form-group';

@Component({
  selector: 'app-id-only',
  templateUrl: './id-only.component.html',
  styleUrls: ['../sharedstyles.css'],
})
export class IdOnlyComponent extends TemplateComponent implements OnInit, OnDestroy {
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
    this.setInputParameters(this.configId, this.deviceId, this.UUID, this.componentName, this.deviceList, 'IdOnlyComponent', 'nfc', this.slot, this.configurationIsInReadOnlyMode);
    this.currentTitleService.changeTitle('Configuration - ID Only Template');
    // prettier-ignore
    this.createConfigurationObjects(Id_onlyFormGroup, IdOnly_FieldsDefinition, Id_only_getFieldsList);   }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
