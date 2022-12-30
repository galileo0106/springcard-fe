import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICanDoSomethingJsonResponse } from '@shared/models/icandosomethingjsonresponse.model';
import { IPlansList } from '@shared/models/Plan/iplanslist.model';
import { IMe } from '@shared/models/User/me.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { PlanService } from '@shared/services/plan.service';
import { finalize } from 'rxjs/operators';
import Countries from '../../../../assets/countries.json';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  asyncOperation = false;
  userProfile: IMe;
  isEditingProfile = false;
  userPlan: IPlansList | null;
  renewMessage = '';
  expirationDate = '';
  countries = Countries;
  userCountry = '';

  constructor(
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
    this.verifyAccountValidity();
    this.setUserPlan();
    this.loadProfile();
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

  redirectUserTo(route: string) {
    this.router.navigate([route]);
  }

  editProfile() {
    this.isEditingProfile = true;
  }

  canHideEditingProfile(withSuccess: boolean) {
    this.isEditingProfile = false;
    if (withSuccess) {
      this.loadProfile();
    }
  }

  private yourAccountWasRemoved() {
    this.asyncOperation = false;
    this.snackBar.open($localize`Your account was deleted`, $localize`Warning`, {
      duration: 6000,
    });
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }

  private yourAccountWasNotRemoved() {
    this.asyncOperation = false;
    this.snackBar.open($localize`Your account was not deleted`, $localize`Warning`, {
      duration: 4000,
    });
  }

  // Lance réellement la suppression du compte
  private launchAccountRemoval() {
    this.asyncOperation = true;
    this.authService.deleteMe().subscribe(
      () => {
        this.asyncOperation = false;
        this.yourAccountWasRemoved();
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        this.yourAccountWasNotRemoved();
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the deletion of your account:` + '\n\n' + error.message;
        console.error(title, message);
        console.error(error);
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.launchAccountRemoval();
            } else {
              return;
            }
          },
        });
      },
    );
  }

  // Demande de confirmation de la suppression du compte
  private askForAccountRemovalConfirmation() {
    this.dialogsService.yesNo($localize`Account removal`, $localize`Do you really want to remove your account?`).subscribe({
      next: (response: boolean) => {
        if (response) {
          this.launchAccountRemoval();
        } else {
          this.yourAccountWasNotRemoved();
        }
      },
    });
  }

  private yourAccountCantBeDeleted() {
    const message = $localize`Your account can't be deleted because you are the only administrator.`;
    this.snackBar.open(message, $localize`Error`, {
      duration: 6000,
    });
  }

  // Demande de suppression de compte
  removeAccount() {
    if (this.authService.getType() !== 2) {
      this.askForAccountRemovalConfirmation();
      return;
    }

    if (!this.authService.isAdmin()) {
      this.askForAccountRemovalConfirmation();
      return;
    }

    // Plan Team et compte Admin, on vérifie s'il reste d'autres administrateurs
    this.asyncOperation = true;
    this.authService.canRemoveMyAccount().subscribe(
      (response: ICanDoSomethingJsonResponse) => {
        this.asyncOperation = false;
        if (response.Result === true) {
          this.askForAccountRemovalConfirmation();
        } else {
          this.yourAccountCantBeDeleted();
        }
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while verifying if your account can be deleted:` + '\n\n' + error.message;
        console.error(title, message);
        console.error(error);
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.removeAccount();
            } else {
              return;
            }
          },
        });
      },
    );
  }

  upgradeTo(newPlan: string) {
    this.router.navigate(['/subscribe', newPlan]);
  }

  downgradeTo(newPlan: string) {
    this.router.navigate(['/subscribe', newPlan]);
  }
}
