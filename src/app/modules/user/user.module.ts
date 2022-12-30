import { PaypalService } from './../shared/services/paypal.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { MatComponentsModule } from '@matcomponents/mat-components.module';
import { AuthService } from '@shared/services/AuthService';
import { ValdemortModule } from 'ngx-valdemort';
import { HomeUserComponent } from './home-user/home-user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RequestnewpasswordComponent } from './requestnewpassword/requestnewpassword.component';
import { SetnewpasswordComponent } from './setnewpassword/setnewpassword.component';
import { SupportComponent } from './support/support.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DownloadComponent } from './download/download.component';
//import { UserRoutingModule } from './user.routing.module';
import { PricingComponent } from './pricing/pricing.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { PlanService } from '@shared/services/plan.service';
import { PlanComponent } from './plan/plan.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { ManualPaymentService } from '@shared/services/manual-payment.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { YourcompanionComponent } from './yourcompanion/yourcompanion.component';
import { SummaryComponent } from './summary/summary.component';
import { AccountSettingsComponent } from './accountsettings/accountsettings.component';
import { TeamManageComponent } from './teammanage/teammanage.component';
import { UserHistoryComponent } from './userhistory/userhistory.component';

@NgModule({
  declarations: [
    RegisterComponent,
    RequestnewpasswordComponent,
    SetnewpasswordComponent,
    HomeUserComponent,
    LoginComponent,
    SupportComponent,
    WelcomeComponent,
    DownloadComponent,
    PricingComponent,
    AccountComponent,
    ProfileComponent,
    PlanComponent,
    ContributorsComponent,
    SubscribeComponent,
    YourcompanionComponent,
    SummaryComponent,
    AccountSettingsComponent,
    TeamManageComponent,
    UserHistoryComponent,
  ],
  imports: [
    CommonModule,
    MatComponentsModule,
    CoreModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ValdemortModule,
    FontAwesomeModule
    //UserRoutingModule,
  ],
  exports: [],
  providers: [AuthService, PlanService, PaypalService, ManualPaymentService],
})
export class UserModule {}
