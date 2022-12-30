import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { IRequestNewPassword } from '@shared/models/User/requestnewpassword.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';

@Component({
  selector: 'app-requesnewpassword',
  templateUrl: './requestnewpassword.component.html',
  styleUrls: ['./requestnewpassword.component.scss'],
})
export class RequestnewpasswordComponent implements OnInit {
  requestNewPasswordForm: UntypedFormGroup;
  private topButtons = Array<ITopButton>();

  isRequested = false;
  isRequesting = false;

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
  ) {
    this.currentTitleService.changeTitle($localize`Ask for a new password`);
    this.valdemortConfig.displayMode = DisplayMode.ONE; // ALL
    this.valdemortConfig.shouldDisplayErrors = () => true;
    this.topButtons = [];
  }

  ngOnInit() {
    const email = this.authService.getEmailFromSession();
    this.requestNewPasswordForm = this.fb.group({
      email: [email, [Validators.required, Validators.email]],
    });
    this.topButtonsService.setTopButtons(this.topButtons);
  }

  requestNewPassword() {
    if ( this.isRequesting ) return;
    if ( !this.requestNewPasswordForm.value.email ) return;
    this.isRequesting = true;
    const registerParam: IRequestNewPassword = {
      email: getFieldValue(this.requestNewPasswordForm, 'email'),
    };
    this.authService.requestNewPassword(registerParam).subscribe(
      (response) => {
        this.isRequesting = false;
        let message = '';
        let title = '';
        //let okToRedirect = true;
        if (response.Result === 'success') {
          this.isRequested = true;

          message = $localize`Your request succeed, please consult your emails`;
          title = $localize`Success`;
        } else {
          //okToRedirect = false;
          message = response.Message ?? '';
          title = $localize`Error while asking for a new password`;
        }
        this.snackBar.open(message, title, {
          duration: 5000,
        });
        // if (okToRedirect) {
        //   this.router.navigate(['/']);
        // }
      },
      (error: HttpErrorResponse) => {
        this.isRequesting = false;
        let errorMessage = $localize`There was an error while asking for a new password.`;
        if (error.status === 400 || error.status === 404) {
          errorMessage += ' ' + error.error.Message;
        }
        this.dialogsService.retryQuit($localize`Error`, errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.requestNewPassword();
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
