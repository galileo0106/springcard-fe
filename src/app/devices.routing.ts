import { Routes } from '@angular/router';
import { IsNotDirtyGuard } from '@shared/services/can-deactivate-guard.service';
import { Ean17115SpringcoreH518ReferenceComponent } from './modules/configure/ean17115-springcore-h518-reference/ean17115-springcore-h518-reference.component';
import { Ean18035SpringcoreH993CrazyuhfComponent } from './modules/configure/ean18035-springcore-h993-crazyuhf/ean18035-springcore-h993-crazyuhf.component';
import { Ean18036SpringcoreE993CrazyuhfComponent } from './modules/configure/ean18036-springcore-e993-crazyuhf/ean18036-springcore-e993-crazyuhf.component';
import { Ean18090SpringcoreE518ReferenceComponent } from './modules/configure/ean18090-springcore-e518-reference/ean18090-springcore-e518-reference.component';
import { Ean19217SpringcoreE518SpringparkComponent } from './modules/configure/ean19217-springcore-e518-springpark/ean19217-springcore-e518-springpark.component';
import { Fpf18170SpringcoreH518PuckComponent } from './modules/configure/fpf18170-springcore-h518-puck/fpf18170-springcore-h518-puck.component';
import { Fpf18175SpringcoreH518PuckComponent } from './modules/configure/fpf18175-springcore-h518-puck/fpf18175-springcore-h518-puck.component';
import { Fpf18176SpringcoreH518PuckComponent } from './modules/configure/fpf18176-springcore-h518-puck/fpf18176-springcore-h518-puck.component';
import { Fpf18177SpringcoreH518PuckComponent } from './modules/configure/fpf18177-springcore-h518-puck/fpf18177-springcore-h518-puck.component';
import { Fpf18178SpringcoreH518PuckComponent } from './modules/configure/fpf18178-springcore-h518-puck/fpf18178-springcore-h518-puck.component';
import { Fse18283SpringcoreH518Afcare_twoComponent } from './modules/configure/fse18283-springcore-h518-afcare-two/fse18283-springcore-h518-afcare-two.component';
import { SocketMobileS550SpringcoreH518S550Component } from './modules/configure/socket_mobile_s550-springcore-h518-s550/socket_mobile_s550-springcore-h518-s550.component';
import { SpringcoreM519Component } from './modules/configure/-springcore-m519/-springcore-m519.component';
import { TbdSpringcoreE518SpringparkComponent } from './modules/configure/tbd-springcore-e518-springpark/tbd-springcore-e518-springpark.component';
import { LoggedInGuardService } from './modules/shared/services/logged-in-guard.service';

// Le contenu de ce fichier a été généré automatiquement
export const devicesRoutes: Routes = [
  {
    path: 'Ean17115SpringcoreH518ReferenceComponent/:deviceId/:configId/:uuid',    component: Ean17115SpringcoreH518ReferenceComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Ean18035SpringcoreH993CrazyuhfComponent/:deviceId/:configId/:uuid',    component: Ean18035SpringcoreH993CrazyuhfComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Ean18036SpringcoreE993CrazyuhfComponent/:deviceId/:configId/:uuid',    component: Ean18036SpringcoreE993CrazyuhfComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Ean18090SpringcoreE518ReferenceComponent/:deviceId/:configId/:uuid',    component: Ean18090SpringcoreE518ReferenceComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Ean19217SpringcoreE518SpringparkComponent/:deviceId/:configId/:uuid',    component: Ean19217SpringcoreE518SpringparkComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Fpf18170SpringcoreH518PuckComponent/:deviceId/:configId/:uuid',    component: Fpf18170SpringcoreH518PuckComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Fpf18175SpringcoreH518PuckComponent/:deviceId/:configId/:uuid',    component: Fpf18175SpringcoreH518PuckComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Fpf18176SpringcoreH518PuckComponent/:deviceId/:configId/:uuid',    component: Fpf18176SpringcoreH518PuckComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Fpf18177SpringcoreH518PuckComponent/:deviceId/:configId/:uuid',    component: Fpf18177SpringcoreH518PuckComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Fpf18178SpringcoreH518PuckComponent/:deviceId/:configId/:uuid',    component: Fpf18178SpringcoreH518PuckComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Fse18283SpringcoreH518Afcare_twoComponent/:deviceId/:configId/:uuid',    component: Fse18283SpringcoreH518Afcare_twoComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'SocketMobileS550SpringcoreH518S550Component/:deviceId/:configId/:uuid',    component: SocketMobileS550SpringcoreH518S550Component,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'SpringcoreM519Component/:deviceId/:configId/:uuid',    component: SpringcoreM519Component,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'TbdSpringcoreE518SpringparkComponent/:deviceId/:configId/:uuid',    component: TbdSpringcoreE518SpringparkComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
];
