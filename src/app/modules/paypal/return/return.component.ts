import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { DialogsService } from '@shared/services/dialogs.service';
import { PaypalService } from '@shared/services/paypal.service';

/**
 * Composant utilisé en cas de validation du paiement, il reste à demander sa capture au back office.
 */
@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss'],
})
export class ReturnComponent implements OnInit {
  asyncOperation = true;
  hasError = false;
  private token = '';
  private PayerID = '';

  // http://localhost:4200/paypal-return?token=5CJ6879978706742Y&PayerID=R6D3L2Y27GAEG
  constructor(
    private paypalService: PaypalService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getRouteParameters();
  }

  private getRouteParameters() {
    this.token = this.route.snapshot.queryParams['token'];
    this.PayerID = this.route.snapshot.queryParams['PayerID'];
    if (this.token !== undefined && this.PayerID !== undefined) {
      this.captureOrder();
    } else {
      this.snackBar.open($localize`We have not received the expected parameters from Paypal.`, $localize`Error`, {
        duration: 5500,
      });
      this.asyncOperation = false;
      this.hasError = true;
    }
  }

  private captureOrder() {
    this.asyncOperation = true;
    this.paypalService.askForOrderCapture(this.token, this.PayerID).subscribe(
      () => {
        this.asyncOperation = false;
        this.snackBar
          .open(
            $localize`Your payment has been validated, we thank you for it. You are going to be disconnected to apply your new rights and a window is going to be opened to enable you to create your customer account`,
            $localize`Success`,
            {
              duration: 5500,
            },
          )
          .afterDismissed()
          .subscribe(() => {
            this.authService.logout();
            this.app.redirect('https://www.springcard.com/en/contact?request=account', '_self');
          });
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the payment capture:` + '\n\n' + error.message;
        console.error(title, message);
        console.error(error);
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.captureOrder();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }
}
