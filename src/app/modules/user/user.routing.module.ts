import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuardService } from '@shared/services/logged-in-guard.service';
import { AccountComponent } from './account/account.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { PricingComponent } from './pricing/pricing.component';
import { RegisterComponent } from './register/register.component';
import { RequestnewpasswordComponent } from './requestnewpassword/requestnewpassword.component';
import { SetnewpasswordComponent } from './setnewpassword/setnewpassword.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SupportComponent } from './support/support.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SummaryComponent } from './summary/summary.component';
import { YourcompanionComponent } from './yourcompanion/yourcompanion.component';
import { AccountSettingsComponent } from './accountsettings/accountsettings.component';
import { TeamManageComponent } from './teammanage/teammanage.component';
import { UserHistoryComponent } from './userhistory/userhistory.component';

const routes: Routes = [
  {
    path: 'user', // user
    component: HomeUserComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'requestnewpassord',
    component: RequestnewpasswordComponent,
  },
  {
    path: 'setnewpassword',
    component: SetnewpasswordComponent,
  },
  {
    path: 'setnewpassword/:token',
    component: SetnewpasswordComponent,
  },
  {
    path: 'support',
    component: SupportComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'pricing',
    component: PricingComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'contributors',
    component: ContributorsComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'summary',
    component: SummaryComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'yourcompanion',
    component: YourcompanionComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'accountsettings',
    component: AccountSettingsComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'teammanage',
    component: TeamManageComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'userhistory',
    component: UserHistoryComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'subscribe/:plan',
    component: SubscribeComponent,
  },
];

@NgModule({
  imports: [
    // forChild() => for ANY child module, donc pour des modules lazy loadés
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class UserRoutingModule {}
