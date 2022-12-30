import { ChatComponent } from './chat/chat.component';
import { RouterModule, Routes } from '@angular/router';
import { IsNotDirtyGuard } from '@shared/services/can-deactivate-guard.service';
import { LoggedInGuardService } from '@shared/services/logged-in-guard.service';
import { devicesRoutes } from './devices.routing';
import { AboutHomeComponent } from './modules/about/about-home/about-home.component';
import { ChangelogComponent } from './modules/about/changelog/changelog.component';
import { ConfiguredeviceComponent } from './modules/configure/configuredevice/configuredevice.component';
import { HomeConfigureComponent } from './modules/configure/home-configure/home-configure.component';
import { NewconfigurationComponent } from './modules/configure/newconfiguration/newconfiguration.component';
import { SavewriteComponent } from './modules/configure/savewrite/savewrite.component';
import { TemplatesComponent } from './modules/configure/templates/templates.component';
import { CardAnalysisComponent } from './modules/detection/card-analysis/card-analysis.component';
import { HomeDetectionComponent } from './modules/detection/home-detection/home-detection.component';
import { HomeFlashComponent } from './modules/flash/home-flash/home-flash.component';
import { AlleventsComponent } from './modules/websocket/allevents/allevents.component';
import { WseventsComponent } from './modules/websocket/wsevents/wsevents.component';
import { templatesRoutes } from './templates.routing';
import { ScriptorComponent } from './modules/scriptor/scriptor/scriptor.component';
import { PageNotFoundComponent } from '@core/page-not-found/page-not-found.component';
import { IndividualsComponent } from './modules/configure/individuals/individuals.component';
import { TeamConfigurationsComponent } from './modules/configure/team-configurations/team-configurations.component';
import { CancelComponent } from './modules/paypal/cancel/cancel.component';
import { ReturnComponent } from './modules/paypal/return/return.component';
import { HomeUserComponent } from './modules/user/home-user/home-user.component';
import { RegisterComponent } from './modules/user/register/register.component';
import { RequestnewpasswordComponent } from './modules/user/requestnewpassword/requestnewpassword.component';
import { SetnewpasswordComponent } from './modules/user/setnewpassword/setnewpassword.component';
import { SupportComponent } from './modules/user/support/support.component';
import { WelcomeComponent } from './modules/user/welcome/welcome.component';
import { DownloadComponent } from './modules/user/download/download.component';
import { PricingComponent } from './modules/user/pricing/pricing.component';
import { AccountComponent } from './modules/user/account/account.component';
import { ContributorsComponent } from './modules/user/contributors/contributors.component';
import { SubscribeComponent } from './modules/user/subscribe/subscribe.component';
import { TeamProductsComponent } from './modules/detection/team-products/team-products.component';
import { FlashHistoryComponent } from './modules/flash/flash-history/flash-history.component';
import { ServiceDataComponent } from './modules/servicedata/servicedata/servicedata.component';
import { SummaryComponent } from './modules/user/summary/summary.component';
import { YourcompanionComponent } from './modules/user/yourcompanion/yourcompanion.component';
import { AccountSettingsComponent } from './modules/user/accountsettings/accountsettings.component';
import { TeamManageComponent } from './modules/user/teammanage/teammanage.component';
import { UserHistoryComponent } from './modules/user/userhistory/userhistory.component';
import { LoginComponent } from './modules/user/login/login.component';
/**
 * Ne contient QUE les routes qui ne correspondent pas aux périphériques ou aux templates
 */
const applicationRoutes: Routes = [
  {
    path: '',
    redirectTo: '/summary',
    pathMatch: 'full',
    //canActivate: [LoggedInGuardService],
  },
  {
    path: 'detect',
    redirectTo: '/detect/online',
    pathMatch: 'full',
    //canActivate: [LoggedInGuardService],
  },
  {
    path: 'detect/:device-type',
    component: HomeDetectionComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'paypal-return',
    component: ReturnComponent,
  },
  {
    path: 'paypal-cancel',
    component: CancelComponent,
  },
  {
    path: 'wsevents/:deviceId/:readerId',
    component: WseventsComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'flash/:deviceId',
    component: HomeFlashComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'configuredevice/:deviceId',
    component: ConfiguredeviceComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'templates/:deviceId/:configId/:componentName/:uuid',
    component: TemplatesComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'allwsevents',
    component: AlleventsComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'about',
    component: AboutHomeComponent,
  },
  {
    path: 'servicedata',
    component: ServiceDataComponent,
  },
  {
    path: 'newconfig',
    component: NewconfigurationComponent,
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
    path: 'configure',
    component: HomeConfigureComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'teamconfigurations',
    component: TeamConfigurationsComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'savewrite/:deviceId/:configId/:componentName/:uuid',
    component: SavewriteComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'changelog',
    component: ChangelogComponent,
  },
  {
    path: 'cardanalysis/:deviceId/:readerId',
    component: CardAnalysisComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'scriptor/:deviceId/:readerId',
    component: ScriptorComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'individuals/:deviceId',
    component: IndividualsComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'user',
    component: HomeUserComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
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
  /*{
    path: 'setnewpassword/:token',
    component: SetnewpasswordComponent,
  },*/
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
    path: 'download',
    component: DownloadComponent,
  },
  {
    path: 'pricing',
    component: PricingComponent,
    canActivate: [LoggedInGuardService],
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
    path: 'subscribe/:plan',
    component: SubscribeComponent,
  },
  {
    path: 'teamproducts',
    component: TeamProductsComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'flashhistory',
    component: FlashHistoryComponent,
    canActivate: [LoggedInGuardService],
  },
  {
    path: 'helpdesk-chat',
    component: ChatComponent,
    outlet: 'chat',
  },
  // Lazy loading
  /*{
    path: 'user',
    pathMatch: 'full',
    loadChildren: () => import('./modules/user/user.module').then((m) => m.UserModule),
  },*/
  // URL principale ICI

  /*{
    path: '',
    component: HomeDetectionComponent,
    pathMatch: 'full',
    canActivate: [LoggedInGuardService],
  },*/
];

for (const route of devicesRoutes) {
  applicationRoutes.push(route);
}
for (const route of templatesRoutes) {
  applicationRoutes.push(route);
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! La 404 QUI DOIT SE TROUVER EN TOUTE DERNIERE POSITION!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
applicationRoutes.push({
  path: '**',
  component: PageNotFoundComponent,
});

export const appRoutes = applicationRoutes;
RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' }); //  useHash: true,
