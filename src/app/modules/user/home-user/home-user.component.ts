import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IJwtError } from '@shared/models/IJwtError.model';
import { IJwt } from '@shared/models/jwt.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.scss'],
})
export class HomeUserComponent implements OnInit {
  isConnected = false;
  redirectUrl = '';
  email = '';
  renewMessage = '';

  loginForm: UntypedFormGroup;
  private topButtons = Array<ITopButton>();
  isLogging = false;

  constructor(
    private currentTitleService: CurrentTitleService,
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private topButtonsService: TopButtonsService,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private dialogsService: DialogsService,
    private app: ApplicationService,
  ) {
    this.currentTitleService.changeTitle($localize`Connect to companion.springcard.com`);
    this.topButtons = [];
  }

  ngOnInit() {
    if (!this.authService.hasValidatedCGU()) {
      this.router.navigate(['/welcome']);
    }
    this.isConnected = this.authService.isLoggedIn();
    this.verifyAccountValidity();
    this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectURL'];
    if (this.isConnected) {
      this.email = this.authService.getEmailFromSession();
    }
    this.createLoginForm();
    this.selectConnectionMethod();
    this.topButtonsService.setTopButtons(this.topButtons);
  }

  verifyAccountValidity() {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.renewMessage = '';
    if (this.authService.accountIsExpired()) {
      this.renewMessage = $localize`Your account is expired since ` + this.authService.getAccountExpirationDate().toLocaleDateString();
    } else if (this.authService.accountExpiresNextMonth()) {
      this.renewMessage = $localize`Your account will expire on ` + this.authService.getAccountExpirationDate().toLocaleDateString();
    }
  }

  // Sélection de la méthode de connexion
  selectConnectionMethod() {
    if (this.authService.hasPreviousLoginInformation() && this.authService.previousConnectionWasMadeWithSocialProvider()) {
      this.loginWithSocialProvider();
    }
  }

  // Création du formulaire de connexion "classique" avec login/mot de passe
  createLoginForm() {
    this.loginForm = this.fb.group({
      email: [this.authService.getEmailFromSession(), [Validators.required, Validators.email]],
      password: [this.authService.getPasswordFromSession(), Validators.required],
      rememberpassword: [true],
    });
  }

  redirectUserTo(route: string) {
    if (this.redirectUrl === null || !this.redirectUrl) {
      this.router.navigate([route]);
    } else {
      this.router.navigate([route], { queryParams: { redirectURL: this.redirectUrl } });
    }
  }

  logout() {
    this.authService.logout();
    this.authService.success($localize`not connected`);
    this.snackBar.open($localize`Your are disconnected`, $localize`Disconnect`, {
      duration: 4000,
    });
    this.isConnected = this.authService.isLoggedIn();
    this.router.navigate(['./login']);
  }

  // Connexion avec un réseau social
  loginWithSocialProvider() {
    this.authService.loginWithSocialProvider().subscribe(
      (response: IJwt | IJwtError) => {
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`You are connected`;
          title = $localize`Success`;
          this.authService.saveSession(response as IJwt);
        } else {
          message = (response as IJwtError).Message;
          title = $localize`Error while connecting`;
          this.authService.error('not connected');
        }
        this.snackBar.open(message, title, {
          duration: 5000,
        });
        if (this.redirectUrl === null) {
          this.router.navigateByUrl('/');
        } else {
          this.router.navigateByUrl(this.redirectUrl);
        }
      },
      (error: HttpErrorResponse) => {
        this.isLogging = false;
        let errorMessage = $localize`There was an error while connecting.`;
        if (error.status === 400 || error.status === 404) {
          errorMessage += ' ' + error.error.Message;
        }
        this.dialogsService.retryQuit('Error', errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.loginWithSocialProvider();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Connexion classique avec login/mot de passe
  login() {
    if(this.isLogging) return;
    if(this.loginForm.status === "INVALID") return;
    this.isConnected = false;
    const val = this.loginForm.value;
    this.isLogging = true;
    if (val.email && val.password) {
      this.authService
        .login(val.email, val.password, val.rememberpassword)
        .pipe(finalize(() => (this.isLogging = false))) //  = this.authService.isLoggedIn()
        .subscribe(
          (response: IJwt | IJwtError) => {
            this.email = this.authService.getEmailFromSession();
            let message = '';
            let title = '';
            if (response.Result === 'success') {
              this.isConnected = true;
              message = $localize`You are connected`;
              title = $localize`Success`;
              this.authService.saveSession(response as IJwt);
              this.authService.markUserAsLogged();
              this.authService.success(val.email);
            } else {
              this.isConnected = false;
              this.authService.markUserAsLoggedOut();
              message = (response as IJwtError).Message;
              title = $localize`Error while connecting`;
              this.authService.error('not connected');
            }
            this.snackBar.open(message, title, {
              duration: 5000,
            });
            this.router.navigate(['/']);
            location.reload();
          },
          (error: HttpErrorResponse) => {
            this.isConnected = false;
            let errorMessage = $localize`There was an error while connecting.`;
            if (error.status === 400 || error.status === 404) {
              errorMessage += ' ' + error.error.Message;
            }
            this.dialogsService.retryQuit($localize`Error`, errorMessage).subscribe({
              next: (button) => {
                if (button === 'retry') {
                  this.login();
                } else {
                  this.app.appQuitOrCancel();
                }
              },
            });
          },
        );
    }
  }
}
