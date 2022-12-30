import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { IPaypalPaymentInformation } from '@shared/models/ipaypalpaymentinformation.model';
import { IPlansList } from '@shared/models/Plan/iplanslist.model';
import { IJsonResponse } from '@shared/models/jsonresponse.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { ManualPaymentService } from '@shared/services/manual-payment.service';
import { PaypalService } from '@shared/services/paypal.service';
import { Plans, PlanService } from '@shared/services/plan.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
})
export class SubscribeComponent implements OnInit {
  @Input() chosenPlanName = ''; // @todo, supprimer si ça ne sert à rien
  chosenPlan: IPlansList | null;
  plans: IPlansList[] = [];
  asyncOperation = false;
  isConnected = false;
  subscriptionForm: UntypedFormGroup;
  showSuccess = false;
  showCancel = false;
  showError = false;
  hideSubscribeForm = false;

  constructor(
    private currentTitleService: CurrentTitleService,
    private authService: AuthService,
    private paypalService: PaypalService,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private planService: PlanService,
    public route: ActivatedRoute,
    private manualPaymentService: ManualPaymentService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.currentTitleService.changeTitle($localize`Plan subscription`);
    this.plans = this.planService.payingPlans;
    this.getSelectedPlan();
    this.createSubscriptionForm();
    this.isConnected = this.authService.isLoggedIn();
  }

  createSubscriptionForm() {
    this.subscriptionForm = new UntypedFormGroup({
      plan: new UntypedFormControl({ value: this.chosenPlan?.key, disabled: false }, [Validators.required]),
      paymentMethod: new UntypedFormControl({ value: 'manual', disabled: false }, [Validators.required]),
    });
  }

  // Récupération du plan qui a été sélectionné soit depuis @Input soit depuis l'URL
  getSelectedPlan() {
    if (this.chosenPlanName === '') {
      this.searchRouteParameters();
    }
    if (this.chosenPlanName === '') {
      this.snackBar.open($localize`No plan was selected!`, $localize`Error`, {
        duration: 6000,
      });
      this.router.navigate(['/pricing']);
      return;
    }
    this.chosenPlan = this.planService.getPlanCapabilities(this.chosenPlanName as Plans);
  }

  // Récupération du plan sélectionné depuis l'URL
  searchRouteParameters() {
    this.chosenPlanName = this.route.snapshot.paramMap.get('plan') != null ? (this.route.snapshot.paramMap.get('plan') as string) : '0';
  }

  // Sert à la redirection vers l'URL de paiement de Paypal
  goToExternalUrl(url: string): void {
    this.asyncOperation = true;
    this.document.location.href = url;
  }

  payWithPaypal(selectedPlan: string) {
    this.asyncOperation = true;
    this.paypalService.getPaypalOrderUrl(selectedPlan).subscribe(
      (response: IPaypalPaymentInformation | IJsonResponse) => {
        this.asyncOperation = false;
        if (response.Result === 'success') {
          const url = (response as IPaypalPaymentInformation).approveUrl;
          this.goToExternalUrl(url);
        }
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        const message = $localize`Error while asking for the payment url`;
        console.error(message);
        console.error(error);
        this.dialogsService.retryQuit($localize`Error`, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.payWithPaypal(selectedPlan);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  manualPayment(selectedPlan: string) {
    this.asyncOperation = true;
    this.manualPaymentService.manualOrder(selectedPlan).subscribe(
      () => {
        this.asyncOperation = false;
        this.snackBar.open(
          $localize`Our commercial team received your request and will contact you as soon as possible`,
          $localize`Success`,
          {
            duration: 6000,
          },
        );
        this.hideSubscribeForm = true;
      },
      (error: HttpErrorResponse) => {
        const message = $localize`Error while contacting our commercial team`;
        console.error(message);
        console.error(error);
        this.dialogsService.retryQuit($localize`Error`, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.manualPayment(selectedPlan);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Aiguillage en fonction du choix du client
  subsribeToPlan() {
    const selectedPlan = getFieldValue(this.subscriptionForm, 'plan');
    const method = getFieldValue(this.subscriptionForm, 'paymentMethod');
    if (method === 'paypal') {
      this.payWithPaypal(selectedPlan);
    } else {
      this.manualPayment(selectedPlan);
    }
  }
}
