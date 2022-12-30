import { PaypalModule } from './modules/paypal/paypal.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { httpInterceptorProviders } from '@shared/http-interceptors';
import { IsNotDirtyGuard } from '@shared/services/can-deactivate-guard.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import {
  ConfigurationFormSettingsDialog,
  SelectModelApduDialog,
  SelectSlotDialog,
  DialogsService,
  DuplicateConfigurationDialog,
  InputDialog,
  RetryCancelDialog,
  ShowOkDialog,
  YesNoCancelDialog,
} from '@shared/services/dialogs.service';
import { LoggedInGuardService } from '@shared/services/logged-in-guard.service';
import { ServiceService } from '@shared/services/service.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { ValdemortModule } from 'ngx-valdemort';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routing';
import { HeaderActionsComponent } from './header-actions/header-actions.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainTitleComponent } from './main-title/main-title.component';
import { AboutModule } from './modules/about/about.module';
import { ConfigureModule } from './modules/configure/configure.module';
import { DetectionModule } from './modules/detection/detection.module';
import { FlashModule } from './modules/flash/flash.module';
import { MatComponentsModule } from './modules/mat-components/mat-components.module';
import { ScriptorModule } from './modules/scriptor/scriptor.module';
import { ServiceDataModule } from './modules/servicedata/servicedata.module';
import { UserModule } from './modules/user/user.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { ElectronService } from './providers/electron.service';
import { ChatComponent } from './chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FindNetworkDialog, FindSerialDialog } from './modules/detection/home-detection/home-detection.component';
import { ChangePasswordDialog } from './modules/user/accountsettings/accountsettings.component';

@NgModule({
  declarations: [
    AppComponent,
    RetryCancelDialog,
    YesNoCancelDialog,
    InputDialog,
    DuplicateConfigurationDialog,
    ConfigurationFormSettingsDialog,
    SelectModelApduDialog,
    SelectSlotDialog,
    ShowOkDialog,
    MainTitleComponent,
    MainFooterComponent,
    HeaderActionsComponent,
    ChatComponent,
    FindNetworkDialog,
    FindSerialDialog,
    ChangePasswordDialog,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatComponentsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' }), //  @todo Remplacer 'top' par 'enabled' , enableTracing: true    , onSameUrlNavigation: 'reload'
    DetectionModule,
    ConfigureModule,
    UserModule,
    AboutModule,
    WebsocketModule,
    FlashModule,
    ScriptorModule,
    ServiceDataModule,
    PaypalModule,
    ReactiveFormsModule,
    ValdemortModule,
    FontAwesomeModule
  ],
  providers: [
    Title,
    ServiceService,
    httpInterceptorProviders,
    ElectronService,
    DialogsService,
    CurrentTitleService,
    TopButtonsService,
    LoggedInGuardService,
    IsNotDirtyGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
