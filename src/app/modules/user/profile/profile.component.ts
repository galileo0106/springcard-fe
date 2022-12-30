import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getFieldValue } from '@shared/appSettings';
import { Router } from '@angular/router';
import { IJsonSuccessResponse } from '@shared/models/ijson.success.response.model';
import { IJwtError } from '@shared/models/IJwtError.model';
import { ITeamMemberInvitation } from '@shared/models/Team/iteammemberinvitation.model';
import { IUpdateProfile } from '@shared/models/User/iupdateprofile.model';
import { IMe } from '@shared/models/User/me.model';
import { IRegisterUser } from '@shared/models/User/registeruser.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { DialogsService } from '@shared/services/dialogs.service';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';
import Countries from '../../../../assets/countries.json';

/**
 * Composant à appler pour créer ou éditer un compte
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() createAccount = true; // Est-ce qu'on est en création ou en édition de compte ?
  @Input() isTeamAccount = false; // Est-ce qu'on est en création d'un compte Team ?
  @Input() existingUserProfile: IMe; // Si on est en édition, ce sont les données du compte
  @Output() readonly canHideComponent = new EventEmitter<boolean>(); // Pour indiquer le clic sur le bouton "Cancel" et cacher le composant

  registerForm: UntypedFormGroup;
  showErrorDiv = false;
  registerOk = false;
  countries = Countries;
  asyncOperation = false;
  isInviting = false;
  isSaving = false;
  isRegistering = false;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private valdemortConfig: ValdemortConfig,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogsService: DialogsService,
    private app: ApplicationService,
  ) {
    this.valdemortConfig.displayMode = DisplayMode.ONE; // ALL
    this.valdemortConfig.shouldDisplayErrors = () => true;
  }

  ngOnInit(): void {
    this.createProfileForm();
    if (!this.createAccount) {
      this.patchFormContent();
    }
  }

  createProfileForm() {
    if (this.createAccount) {
      if (this.isTeamAccount) {
        this.registerForm = this.fb.group({
          first_name: [''],
          last_name: [''],
          email: ['', [Validators.required, Validators.email]],
          admin: [false, [Validators.required]],
        });
      } else {
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
    } else {
      // Édition de compte, pour le moment on ne peut pas changer son adresse mail
      this.registerForm = this.fb.group({
        first_name: [''],
        last_name: [''],
        company: [''],
        country: ['', [Validators.required]],
        phone: ['', Validators.required],
        vat: [''],
        newsletter: ['', Validators.required],
        products_used_for: [''],
      });
    }
  }

  // Mise en place des données (existantes) du compte dans le formulaire
  patchFormContent() {
    this.registerForm.patchValue(this.existingUserProfile);
    if (this.existingUserProfile.newsletter) {
      this.registerForm.patchValue({ newsletter: '1' });
    } else {
      this.registerForm.patchValue({ newsletter: '0' });
    }
  }

  acceptConditionsChecked(): boolean {
    const acceptContions = this.registerForm.get('accept_conditions');
    if (!acceptContions) {
      return false;
    }
    return acceptContions.value === 1 ? true : false;
  }

  // Aiguillage, invitation à rejoindre une équipe, création ou mise à jour du compte
  save() {
    if (this.isTeamAccount) {
      this.sendTeamInvitation();
    } else if (this.createAccount) {
      this.register();
    } else {
      this.update();
    }
  }

  // Invitation à joindre une équipe
  sendTeamInvitation() {
    this.asyncOperation = true;
    this.isInviting = true;
    this.showErrorDiv = false;
    if (this.authService.getEmailFromSession() === getFieldValue(this.registerForm, 'email')) {
      this.snackBar.open($localize`You can't send an invitation to yourself`, $localize`Error`, {
        duration: 7000,
      });
      return;
    }

    const teamProfile: ITeamMemberInvitation = {
      first_name: getFieldValue(this.registerForm, 'first_name'),
      last_name: getFieldValue(this.registerForm, 'last_name'),
      email: getFieldValue(this.registerForm, 'email'),
      admin: getFieldValue(this.registerForm, 'admin') === 'true' ? true : false,
    };
    this.authService.inviteTeamMember(teamProfile).subscribe(
      (response: IJsonSuccessResponse | IJwtError) => {
        this.asyncOperation = false;
        this.isInviting = false;
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`The invitation to join the team was sent with success.`;
          title = $localize`Success`;
          this.cancelEdition(true);
        } else {
          this.showErrorDiv = true;
          message = (response as IJwtError).Message;
          title = $localize`Error while sending the invitation`;
        }
        this.snackBar.open(message, title, {
          duration: 7000,
        });
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        let errorMessage = $localize`Error while sending the invitation`;
        //if (error.status === 422 || error.status === 409 || error.status === 402) {
        errorMessage += ' ' + error.error.Message;
        //}
        this.dialogsService.retryQuit('Error', errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.sendTeamInvitation();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Mise à jour du compte
  update() {
    if ( this.asyncOperation ) return;
    if( this.registerForm.status === "INVALID") return;
    this.asyncOperation = true;
    this.isSaving = true;
    this.showErrorDiv = false;
    const updatedProfile: IUpdateProfile = {
      first_name: getFieldValue(this.registerForm, 'first_name'),
      last_name: getFieldValue(this.registerForm, 'last_name'),
      company: getFieldValue(this.registerForm, 'company'),
      country: getFieldValue(this.registerForm, 'country'),
      phone: getFieldValue(this.registerForm, 'phone'),
      // vat: getFieldValue(this.registerForm, 'vat'),
      // newsletter: getFieldValue(this.registerForm, 'newsletter'),
      // products_used_for: getFieldValue(this.registerForm, 'products_used_for'),
    };
    this.authService.updateProfile(updatedProfile).subscribe(
      (response) => {
        this.asyncOperation = false;
        this.isSaving = false;
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`Your account was updated with success.`;
          title = $localize`Success`;
          this.cancelEdition(true);
        } else {
          this.showErrorDiv = true;
          message = response.Message ?? '';
          title = $localize`Error while updating your account`;
        }
        this.snackBar.open(message, title, {
          duration: 7000,
        });
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        let errorMessage = $localize`Error while updating your account`;
        if (error.status === 422 || error.status === 409) {
          errorMessage += ' ' + error.error.Message;
        }
        this.dialogsService.retryQuit('Error', errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.update();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Création de compte
  register() {
    if ( this.asyncOperation ) return;
    if( this.registerForm.status === "INVALID") return;
    const password = getFieldValue(this.registerForm, 'password');
    const passwordconfirmation = getFieldValue(this.registerForm, 'passwordconfirmation');
    if (password.trim() === '' || passwordconfirmation.trim() === '') {
      this.snackBar.open($localize`Enter a password and the confirmation`, $localize`Error`, {
        duration: 5000,
      });
      return;
    }

    if (password.trim() !== passwordconfirmation.trim()) {
      this.snackBar.open($localize`Password and its confirmation must match`, $localize`Error`, {
        duration: 5000,
      });
      return;
    }

    this.asyncOperation = true;
    this.isRegistering = true;
    this.showErrorDiv = false;

    const updatedProfile: IRegisterUser = {
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
    this.authService.register(updatedProfile).subscribe(
      (response) => {
        this.asyncOperation = false;
        this.isRegistering = false;
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

  cancelEdition(withSuccess = true) {
    this.canHideComponent.emit(withSuccess);
  }

  goBackToLogin() {
    this.router.navigate(['./login']);
  }
}
