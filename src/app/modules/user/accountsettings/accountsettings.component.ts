import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IPlansList } from '@shared/models/Plan/iplanslist.model';
import { IMe } from '@shared/models/User/me.model';
import { IUpdateProfile } from '@shared/models/User/iupdateprofile.model';
import { IChangePassword } from '@shared/models/User/changepassword.model';
import { getFieldValue } from '@shared/appSettings';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { PlanService } from '@shared/services/plan.service';
import { finalize } from 'rxjs/operators';
import Countries from '../../../../assets/countries.json';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-accountsettings',
  templateUrl: './accountsettings.component.html',
  styleUrls: ['./accountsettings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  asyncOperation = false;
  userProfile: IMe;
  isEditingProfile = false;
  isSaving = false;
  userPlan: IPlansList | null;
  renewMessage = '';
  expirationDate = '';
  countries = Countries;
  userCountry = '';
  connectionMethod = '';
  isChangePassBtnShow = false;
  showErrorDiv = false;
  planType = 1;

  generalForm: UntypedFormGroup;
  detailsForm: UntypedFormGroup;
  subscriptForm: UntypedFormGroup;

  faGearIcon = faGear;

  constructor(
    private fb: UntypedFormBuilder,
    private fb1: UntypedFormBuilder,
    private fb2: UntypedFormBuilder,
    public dialog: MatDialog,
    private currentTitleService: CurrentTitleService,
    private authService: AuthService,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private planService: PlanService,
  ) {}

  ngOnInit(): void {
    this.currentTitleService.changeTitle($localize`Account settings`);
    // this.verifyAccountValidity();
    this.setUserPlan();
    this.loadProfile();
    this.getConnectionMethod();
    this.createGeneralForm();
    this.createDetailForm();
    this.createSubscriptForm();
  }

  openDialog(value: string) {
    if ( value === 'changepass' ) {
      this.dialog.open(ChangePasswordDialog, { width: '450px' });
    }
  }

  verifyAccountValidity() {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.expirationDate = this.authService.getAccountExpirationDate().toLocaleDateString();
    this.renewMessage = '';
    if (this.authService.accountIsExpired()) {
      this.renewMessage = $localize`Your account is expired since ` + this.authService.getAccountExpirationDate().toLocaleDateString();
    } else if (this.authService.accountExpiresNextMonth()) {
      this.renewMessage = $localize`Your account will expire on ` + this.authService.getAccountExpirationDate().toLocaleDateString();
    }
  }

  setUserPlan() {
    this.userPlan = this.planService.getUserPlan();
    if ( this.userPlan?.key == 'free' )
      this.planType = 1;
    else if ( this.userPlan?.key == 'single' )
      this.planType = 2;
    else this.planType = 3;
  }

  setUserCountry() {
    this.userCountry = '';
    const userCountryCode = this.userProfile.country;
    for (const country of this.countries) {
      if (country.code === userCountryCode) {
        this.userCountry = country.name;
      }
    }
  }

  loadProfile() {
    this.asyncOperation = true;
    this.authService
      .me()
      .pipe(finalize(() => (this.asyncOperation = false)))
      .subscribe(
        (profile: IMe) => {
          this.userProfile = profile;
          this.setUserCountry();
          this.setDetailsFormValue(profile);
          this.authService.setTypeFromString(profile.user_account_type);
        },
        (error: HttpErrorResponse) => {
          const title = $localize`Error during a network request`;
          const message = $localize`There was an error while getting your profile` + '\n\n' + error.message;
          this.dialogsService.retryQuit(title, message).subscribe({
            next: (button) => {
              if (button === 'retry') {
                this.loadProfile();
              } else {
                this.app.appQuitOrCancel();
              }
            },
          });
        },
      );
  }

  setDetailsFormValue(userProfile: IMe) {
    this.detailsForm.setValue({
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      company: userProfile.company,
      country: userProfile.country,
      phone: userProfile.phone,
    });
  }

  getConnectionMethod() {
    const method = localStorage.getItem('sc_socialProvider');
    switch( method ) {
      case 'loginpassword':
        this.connectionMethod = 'Email+password';
        this.isChangePassBtnShow = true;
        break;
      case 'google':
        this.connectionMethod = 'Google';
        break;
      case 'facebook':
        this.connectionMethod = 'Facebook';
        break;
      case 'apple':
        this.connectionMethod = 'Apple';
        break;
      case 'linkedin':
        this.connectionMethod = 'LinkedIn';
        break;
      case 'github':
        this.connectionMethod = 'Github';
        break;
    }
  }

  createGeneralForm() {
    this.generalForm = this.fb.group({
      email: [localStorage.getItem('sc_email'), [Validators.required, Validators.email]],
      connectionMethod: [this.connectionMethod],
    })
  }

  createDetailForm() {
    this.detailsForm = this.fb1.group({
      first_name: [''],
      last_name: [''],
      company: [''],
      phone: [''],
      country: ['', [Validators.required]],
    })
  }

  createSubscriptForm() {
    if ( this.planType == 1 ) {
      this.subscriptForm = this.fb2.group({
        account_number: [''],
        plantype: ['single'],
        billing: ['yearly']
      })
    }
    else if ( this.planType == 2 ) {
      this.subscriptForm = this.fb2.group({
        account_number: [''],
        plan: [''],
        active_until: [''],
      })
    }
    else {
      this.subscriptForm = this.fb2.group({});
    }
  }

  redirectUserTo(route: string) {
    this.router.navigate([route]);
  }

  editProfile() {
    this.isEditingProfile = true;
  }

  saveProfile() {
    this.update();
  }

  cancelEditing() {
    this.isEditingProfile = false;
  }

  update() {
    if ( this.asyncOperation ) return;
    if( this.detailsForm.status === "INVALID") return;
    this.isSaving = true;
    this.showErrorDiv = false;
    const updatedProfile: IUpdateProfile = {
      first_name: getFieldValue(this.detailsForm, 'first_name'),
      last_name: getFieldValue(this.detailsForm, 'last_name'),
      company: getFieldValue(this.detailsForm, 'company'),
      country: getFieldValue(this.detailsForm, 'country'),
      phone: getFieldValue(this.detailsForm, 'phone'),
    };
    this.authService.updateProfile(updatedProfile).subscribe(
      (response) => {
        this.isSaving = false;
        this.isEditingProfile = false;
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`Your account was updated with success.`;
          title = $localize`Success`;
          // this.cancelEdition(true);
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

  logout() {
    this.authService.logout();
    this.authService.success($localize`not connected`);
    this.snackBar.open($localize`Your are disconnected`, $localize`Disconnect`, {
      duration: 4000,
    });
    // this.isConnected = this.authService.isLoggedIn();
    this.router.navigate(['./login']);
  }

  upgradeTo(newPlan: string) {
    this.router.navigate(['/subscribe', newPlan]);
  }

  downgradeTo(newPlan: string) {
    this.router.navigate(['/subscribe', newPlan]);
  }
}

@Component({
  selector: 'changepassword-dialog',
  templateUrl: './changepassword-dialog.html'
})
export class ChangePasswordDialog {
  isChangingPassword = false;
  minPw = 8;
  curPassword = '';
  passwordForm: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private dialogRef: MatDialogRef<ChangePasswordDialog>
  ) { }
  ngOnInit() {
    this.createPasswordForm();
  }

  createPasswordForm() {
    this.passwordForm = this.fb.group({
      oldpassword: ['', [Validators.required]],
      newpassword: ['', [Validators.required, Validators.minLength(this.minPw)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(this.minPw)]], 
    })
  }

  changePassword() {
    if ( this.isChangingPassword ) return;
    const newUserPassword = getFieldValue(this.passwordForm, 'newpassword');
    const newPasswordConfirmation = getFieldValue(this.passwordForm, 'confirmpassword');
    if (newUserPassword.trim() !== newPasswordConfirmation.trim()) {
      this.snackBar.open($localize`Your password confirmation is not equal to your new password`, $localize`Error`, {
        duration: 5500,
      });
      return;
    }
    this.isChangingPassword = true;
    const newPasswordModel: IChangePassword = {
      oldpassword: getFieldValue(this.passwordForm, 'oldpassword'),
      newpassword: getFieldValue(this.passwordForm, 'newpassword'),
    };

    this.authService.changePassword(newPasswordModel).subscribe(
      (response) => {
        let message = '';
        let title = '';    
        //let okToRedirect = true;
        if (response.Result === 'success') {
          this.isChangingPassword = false;
          message = $localize`You password was changed with success.`;
          title = $localize`Success`;
        } else {
          //okToRedirect = false;
          message = response.Message ?? '';
          title = $localize`Error while changing your password`;
        }
        this.snackBar.open(message, title, {
          duration: 5000,
        });
        this.dialogRef.close();
      },
      (error: HttpErrorResponse) => {
        this.isChangingPassword = false;
        let errorMessage = $localize`There was an error while changing your password.`;
        if (error.status === 400 || error.status === 404) {
          errorMessage += ' ' + error.error.Message;
        }
        this.dialogsService.retryQuit($localize`Error`, errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.changePassword();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }
}