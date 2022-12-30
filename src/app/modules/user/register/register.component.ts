import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { IRegisterUser } from '@shared/models/User/registeruser.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';
import Countries from '../../../../assets/countries.json';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: UntypedFormGroup;
  private topButtons = Array<ITopButton>();
  showErrorDiv = false;
  registerOk = false;
  countries = Countries;
  asyncOperation = false;

  constructor(
    private currentTitleService: CurrentTitleService,
    private topButtonsService: TopButtonsService,
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private valdemortConfig: ValdemortConfig,
    private snackBar: MatSnackBar,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private router: Router,
  ) {
    this.currentTitleService.changeTitle($localize`Create an account`);
    this.valdemortConfig.displayMode = DisplayMode.ONE; // ALL
    this.valdemortConfig.shouldDisplayErrors = () => true;
    this.topButtons = [];
    this.registerForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      company: [''],
      country: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      vat: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordconfirmation: ['', [Validators.required, Validators.minLength(8)]],
      newsletter: ['', Validators.required],
      products_used_for: [''],
      accept_conditions: [0, Validators.required],
    });
  }

  ngOnInit() {
    this.topButtonsService.setTopButtons(this.topButtons);
  }

  acceptConditionsChecked(): boolean {
    const acceptContions = this.registerForm.get('accept_conditions');
    if (!acceptContions) {
      return false;
    }
    return acceptContions.value === 1 ? true : false;
  }

  redirectUserTo(route: string) {
    this.router.navigate([route]);
  }

  register() {
    const password = getFieldValue(this.registerForm, 'password');
    const passwordconfirmation = getFieldValue(this.registerForm, 'passwordconfirmation');
    if (password.trim() === '' || passwordconfirmation.trim() === '') {
      this.snackBar.open($localize`Enter a password and the confirmation`, $localize`Error`, {
        duration: 7000,
      });
      return;
    }

    if (password.trim() !== passwordconfirmation.trim()) {
      this.snackBar.open($localize`Password and its confirmation must match`, $localize`Error`, {
        duration: 7000,
      });
      return;
    }

    this.asyncOperation = true;

    const registerParam: IRegisterUser = {
      first_name: getFieldValue(this.registerForm, 'first_name'),
      last_name: getFieldValue(this.registerForm, 'last_name'),
      company: getFieldValue(this.registerForm, 'company'),
      email: getFieldValue(this.registerForm, 'email'),
      password: getFieldValue(this.registerForm, 'password'),
      newsletter: getFieldValue(this.registerForm, 'newsletter'),
      products_used_for: getFieldValue(this.registerForm, 'products_used_for'),
      phone: getFieldValue(this.registerForm, 'phone'),
      country: getFieldValue(this.registerForm, 'country'),
      vat: getFieldValue(this.registerForm, 'vat'),
    };
    this.authService.register(registerParam).subscribe(
      (response) => {
        this.asyncOperation = false;
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`Your account was created with success, please consult your mails.`;
          title = $localize`Success`;
          this.registerOk = true;
        } else {
          this.showErrorDiv = true;
          message = response.Message ?? '';
          title = $localize`Error while creating your account`;
        }
        this.snackBar.open(message, title, {
          duration: 7000,
        });
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        let errorMessage = $localize`Error while creating your account`;
        if (error.status === 422 || error.status === 409) {
          errorMessage += ' ' + error.error.Message;
        }
        this.dialogsService.retryQuit('Error', errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.register();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }
}
