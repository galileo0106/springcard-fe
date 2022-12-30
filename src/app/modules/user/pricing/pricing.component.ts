import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPlansList } from '@shared/models/Plan/iplanslist.model';
import { IPlansOptionsLabels } from '@shared/models/Plan/iplansoptionslabels.model';
import { IMe } from '@shared/models/User/me.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { PlanService } from '@shared/services/plan.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  plansList: IPlansList[] = [];
  currentUserPlan: IPlansList | null = null;
  plansAccess: IPlansOptionsLabels[];
  profileLoaded = false;
  userProfile: IMe;

  constructor(
    private currentTitleService: CurrentTitleService,
    private planService: PlanService,
    public authService: AuthService,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private router: Router,
  ) {
    this.currentTitleService.changeTitle($localize`Pricing`);
    this.plansList = this.planService.plans;
    this.plansAccess = this.planService.plansOptionsAccesList;
    this.currentUserPlan = this.planService.getUserPlan();
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadProfile(); // On recherche le type de compte
    } else {
      this.profileLoaded = true;
    }
  }

  // Chargement du profil de l'utilisateur
  loadProfile() {
    this.authService
      .me()
      .pipe(finalize(() => (this.profileLoaded = true)))
      .subscribe(
        (profile: IMe) => {
          this.userProfile = profile;
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

  // Demande de souscription à un plan
  subscribe(plan: string) {
    this.router.navigate(['/subscribe', plan]);
  }
}
