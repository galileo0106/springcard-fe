import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '@shared/services/application.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { PaypalService } from '@shared/services/paypal.service';

/**
 * Demande d'anulation d'une demande de paiement
 */
@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss'],
})
export class CancelComponent implements OnInit {
  hasError = false;
  asyncOperation = true;
  private token = '';

  // http://localhost:4200/paypal-cancel?token=31J877544T424312T
  constructor(
    private paypalService: PaypalService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getTokenFromRoute();
  }

  getTokenFromRoute() {
    this.token = this.route.snapshot.queryParams['token'];
    if (this.token !== undefined) {
      this.cancelPayment();
    } else {
      this.snackBar.open($localize`We have not received the expected parameters from Paypal.`, $localize`Error`, {
        duration: 5500,
      });
      this.asyncOperation = false;
      this.hasError = true;
    }
  }

  cancelPayment() {
    this.asyncOperation = true;
    this.paypalService.cancelPaymentRequest(this.token).subscribe(
      () => {
        this.asyncOperation = false;
        this.snackBar.open($localize`The payment request was canceled with success`, $localize`Success`, {
          duration: 4000,
        });
        this.router.navigate(['/']);
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the payment cancelation:` + '\n\n' + error.message;
        console.error(title, message);
        console.error(error);
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.cancelPayment();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }
}
