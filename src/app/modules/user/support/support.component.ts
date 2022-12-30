import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DevicesList } from '@configurations/devicesList';
import { getFieldValue } from '@shared/appSettings';
import { Device } from '@shared/classes/Device';
import { IMe } from '@shared/models/User/me.model';
import { ISupport } from '@shared/models/support.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { ServiceService } from '@shared/services/service.service';
import { SettingsService } from '@shared/services/settings.service';
import { zip } from 'rxjs';
import { DetectionService } from '../../detection/detection.service';

/**
 * Ask for user support
 */
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  devicesList = DevicesList; // Vérifié, on garde
  sources = [
    $localize`(unknown)`,
    $localize`Installation issue / Troubleshooting`,
    $localize`Usage-related issue (hardware product)`,
    $localize`Usage-related issue (software / application)`,
    $localize`Development-related issue (software / SDK)`,
    $localize`Integration-related issue / Question regardig hardware`,
    $localize`Product damaged or broken`,
    $localize`General enquiry`,
  ];
  isGettingUserInformation = false;
  supportForm: UntypedFormGroup;
  serviceVersions: any;
  serviceSettings: any;
  isAsynk: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private currentTitleService: CurrentTitleService,
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private detectService: DetectionService,
    private serviceInformations: ServiceService,
    private settings: SettingsService,
  ) {
    this.currentTitleService.changeTitle($localize`Support`);
  }

  ngOnInit() {
    const supportFormObject = {
      first_name: new UntypedFormControl({ value: '', disabled: false }, [Validators.required]),
      last_name: new UntypedFormControl({ value: '', disabled: false }, [Validators.required]),
      company: new UntypedFormControl({ value: '', disabled: false }),
      email: new UntypedFormControl({ value: '', disabled: false }, [Validators.email]),
      product: new UntypedFormControl({ value: '', disabled: false }),
      other_product: new UntypedFormControl({ value: '', disabled: false }),
      serial_number: new UntypedFormControl({ value: '', disabled: false }),
      subject: new UntypedFormControl({ value: '', disabled: false }, [Validators.required]),
      message: new UntypedFormControl({ value: '', disabled: false }, [Validators.required]),
      source: new UntypedFormControl({ value: '', disabled: false }),
    };
    this.getInformationsForSupport();
    this.supportForm = this.fb.group(supportFormObject);
  }

  private fillSerialNumberFromDevices(devices: Device[]) {
    if (devices.length === 0) {
      return;
    }
    this.supportForm.patchValue({
      serial_number: devices[0].SerialNumber,
    });
  }

  private setDefaultDevice(devices: Device[]) {
    if (devices.length === 0) {
      return;
    }
    for (const device of this.devicesList) {
      if (device.title === devices[0].Name) {
        this.supportForm.patchValue({
          product: devices[0].Name,
        });
      }
    }
  }

  /**
   * Enchaînement de requêtes pour connaître :
   * - Les versions des dépendances du service
   * - Les options du service définies dans la base de registre
   * - La liste des périphériques de l'utilisateur
   * - Les informations (nom, prénom, société, etc) de l'utilisateur
   */
  getInformationsForSupport() {
    if (this.settings.getBoolean('runWithoutService', false)) {
      return;
    }
    this.isGettingUserInformation = true;
    let serviceInformations = this.serviceInformations.getServiceVersions();
    let serviceSettings = this.serviceInformations.getServiceSettings();
    let devicesList = this.detectService.getDevicesList();
    let userInformation = this.authService.me();
    zip(serviceInformations, serviceSettings, devicesList, userInformation).subscribe(
      (emitedValues) => {
        for (const emitedValue of emitedValues) {
          if (emitedValue === null) {
            const message = $localize`Error while getting required information for SpringCard support`;
            console.error(message);
            console.error(emitedValues);
            this.snackBar.open(message, $localize`Error`, {
              duration: 7000,
            });
            return;
          }
        }
        this.serviceVersions = emitedValues[0];
        this.serviceSettings = emitedValues[1];
        const devices: Device[] = emitedValues[2];
        const userInformations: IMe = emitedValues[3];
        this.fillSerialNumberFromDevices(devices);
        this.setDefaultDevice(devices);
        this.authService.setTypeFromString(userInformations.user_account_type);
        this.supportForm.patchValue(userInformations);
        let messageBody =
          '\n\n' + '-'.repeat(30) + '\n' + $localize`Here is the list of my devices:` + '\n' + JSON.stringify(devices) + '\n';
        messageBody += '\n' + $localize`Here is the list of component versions:` + '\n' + JSON.stringify(this.serviceVersions) + '\n';
        messageBody += '\n' + $localize`Here is the service settings:` + '\n' + JSON.stringify(this.serviceSettings) + '\n';
        this.supportForm.patchValue({
          message: messageBody,
        });
      },
      (error: HttpErrorResponse) => {
        const message = $localize`Error while getting required information for SpringCard support` + '\n' + error.status + error.message;
        console.error(message, error);
        this.snackBar.open(message, $localize`Error`, {
          duration: 7000,
        });
      },
      () => {
        // complete
        this.isGettingUserInformation = false;
      },
    );
  }

  // Traite la soumission du formulaire
  support() {
    if(this.isAsynk) return;
    if(this.supportForm.invalid) {
      const message = $localize`Please input Subject and Message field.`
      this.snackBar.open(message, $localize`Invalid`, {
        duration: 5000,
      });
      return;
    }
    const supportParam: ISupport = {
      first_name: getFieldValue(this.supportForm, 'first_name'),
      last_name: getFieldValue(this.supportForm, 'last_name'),
      email: getFieldValue(this.supportForm, 'email'),
      subject: getFieldValue(this.supportForm, 'subject'),
      message: getFieldValue(this.supportForm, 'message'),
      company: getFieldValue(this.supportForm, 'company'),
      source: getFieldValue(this.supportForm, 'source'),
      product: getFieldValue(this.supportForm, 'product'),
      other_product: getFieldValue(this.supportForm, 'other_product'),
      serial_number: getFieldValue(this.supportForm, 'serial_number'),
    };
    this.isAsynk = true;
    this.authService.support(supportParam).subscribe(
      (response) => {
        this.isAsynk = false;
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`Your request for support was sent with success`;
          title = $localize`Success`;
        } else {
          message = response.Message ?? '';
          title = $localize`Error while sending your support request`;
        }
        this.snackBar.open(message, title, {
          duration: 5000,
        });
        const link = ['/'];
        this.router.navigate(link);
      },
      (error: HttpErrorResponse) => {
        this.isAsynk = false;
        let errorMessage = $localize`Error while asking for support.`;
        if (error.status === 422 || error.status === 409) {
          errorMessage += ' ' + error.error.Message;
        }
        this.dialogsService.retryQuit($localize`Error`, errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.support();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }
}
