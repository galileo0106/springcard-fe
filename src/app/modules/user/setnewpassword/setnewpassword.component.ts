import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { ISetNewPassword } from '@shared/models/User/setnewpassword.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';

@Component({
  selector: 'app-setnewpassword',
  templateUrl: './setnewpassword.component.html',
  styleUrls: ['./setnewpassword.component.scss'],
})
export class SetnewpasswordComponent implements OnInit {
  setNewPasswordForm: UntypedFormGroup;
  private topButtons = Array<ITopButton>();
  token = '';

  isReseted = false;
  isReseting = false;

  constructor(
    private currentTitleService: CurrentTitleService,
    private topButtonsService: TopButtonsService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private valdemortConfig: ValdemortConfig,
    private snackBar: MatSnackBar,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private route: ActivatedRoute,
  ) {
    this.currentTitleService.changeTitle($localize`Change password`);
    this.valdemortConfig.displayMode = DisplayMode.ONE; // ALL
    this.valdemortConfig.shouldDisplayErrors = () => true;
    this.topButtons = [];
  }

  ngOnInit() {
    this.topButtonsService.setTopButtons(this.topButtons);
    this.getTokenFromRouteParameters();
    this.createForm();
  }

  getTokenFromRouteParameters() {
    //this.token = this.route.snapshot.paramMap.get('token') != null ? (this.route.snapshot.paramMap.get('token') as string) : '';
    this.token = this.route.snapshot.queryParams['token'] != null ? this.route.snapshot.queryParams['token'] : '';
  }

  createForm() {
    let email = this.authService.getEmailFromSession();
    this.setNewPasswordForm = this.fb.group({
      email: [email, [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      token: [this.token, Validators.required],
    });
  }

  askToSetNewPassword() {
    if ( this.isReseting ) return;
    const newUserPassword = getFieldValue(this.setNewPasswordForm, 'password');
    const newPasswordConfirmation = getFieldValue(this.setNewPasswordForm, 'confirmpassword');
    if (newUserPassword.trim() !== newPasswordConfirmation.trim()) {
      this.snackBar.open($localize`Your password confirmation is not equal to your new password`, $localize`Error`, {
        duration: 5500,
      });
      return;
    }
    this.isReseting = true;
    const newPasswordModel: ISetNewPassword = {
      email: getFieldValue(this.setNewPasswordForm, 'email'),
      password: newUserPassword.trim(),
      token: getFieldValue(this.setNewPasswordForm, 'token'),
    };

    this.authService.setNewPassword(newPasswordModel).subscribe(
      (response) => {
        let message = '';
        let title = '';
        //let okToRedirect = true;
        this.isReseting = false;
        if (response.Result === 'success') {
          this.isReseted = true;
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
        // if (okToRedirect) {
        //   this.router.navigate(['/login']);
        // }
      },
      (error: HttpErrorResponse) => {
        this.isReseting = false;
        let errorMessage = $localize`There was an error while changing your password.`;
        if (error.status === 400 || error.status === 404) {
          errorMessage += ' ' + error.error.Message;
        }
        this.dialogsService.retryQuit($localize`Error`, errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.askToSetNewPassword();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  goBackToLogin() {
    this.router.navigate(['./login']);
  }
}
