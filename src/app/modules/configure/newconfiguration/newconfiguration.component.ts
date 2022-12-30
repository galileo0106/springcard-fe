import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DevicesList } from '@configurations/devicesList';
import { getFieldValue } from '@shared/appSettings';
import { ProductConfiguration } from '@shared/classes/ProductConfiguration';
import { Project } from '@shared/classes/Project';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@shared/services/AuthService';
import { ICanDoSomethingJsonResponse } from '@shared/models/icandosomethingjsonresponse.model';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Permet de créer une nouvelle configuration sans passer par un device
 */
@Component({
  selector: 'app-newconfiguration',
  templateUrl: './newconfiguration.component.html',
  styleUrls: ['./newconfiguration.component.scss'],
})
export class NewconfigurationComponent implements OnInit {
  devicesList = DevicesList; // Déjà vérifié, il faut le garder, c'est utilisé dans le template
  configurationForm: UntypedFormGroup;
  project: Project;
  uuid = '';
  overLimit = false;
  limitLabel = $localize`configurations that you can create`;
  private productConfiguration: ProductConfiguration;

  constructor(
    private currentTitleService: CurrentTitleService,
    private router: Router,
    private snackBar: MatSnackBar,
    private configurationsService: ConfigurationsService,
    private fb: UntypedFormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.currentTitleService.changeTitle($localize`New configuration`);
    this.productConfiguration = new ProductConfiguration(this.configurationsService);
    this.productConfiguration.formBuilder = this.fb;
    this.configurationForm = this.productConfiguration.getConfigurationFormGroup('');
    this.canCreateNewConfiguration();
  }

  changeDevice(deviceTitle: any) {
    const today = new Date();
    this.configurationForm.patchValue({
      title: 
        deviceTitle + ' - ' + 
        $localize`New configuration` + ' ' +
        today.toLocaleDateString() +
        ' ' +
        today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  }

  configure() {
    const selectedDevice = this.configurationForm.get('devices');
    if (!selectedDevice) {
      return;
    }

    const componentName = selectedDevice.value;
    if (componentName.trim() === '') {
      this.snackBar.open($localize`Please select a device`, $localize`Warning`, {
        duration: 4000,
      });
      return;
    }

    // Création d'un nouveau projet
    this.uuid = Project.getUuid();
    this.project = new Project(this.uuid);
    this.project.deviceId = '';
    this.project.componentName = componentName;
    this.project.configurationName = getFieldValue(this.configurationForm, 'title');
    this.project.configurationDescription = getFieldValue(this.configurationForm, 'description');
    //this.project.configurationIsFavorite = getFieldValue(this.configurationForm, 'favorites');
    this.project.save();

    // path: 'Ean17115SpringcoreH518ReferenceComponent/:deviceId/:configId/:uuid',
    this.router.navigate(['/' + componentName, '0', 0, this.uuid]);
  }

  // Est-ce que l'utilisateur peut créer une nouvelle configuration ?
  canCreateNewConfiguration() {
    this.overLimit = false;
    if (this.authService.getType() === 2) {
      // Les comptes team peuvent tout faire
      return;
    }
    this.authService.canCreateConfiguration().subscribe(
      (response: ICanDoSomethingJsonResponse) => {
        if (response.Result === false) {
          this.overLimit = true;
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      },
    );
  }
}
