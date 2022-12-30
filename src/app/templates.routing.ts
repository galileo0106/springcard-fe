import { Routes } from '@angular/router';
import { IsNotDirtyGuard } from '@shared/services/can-deactivate-guard.service';
import { A78164Component } from './modules/configure/a-7816-4/a-7816-4.component';
import { AppleVasComponent } from './modules/configure/apple-vas/apple-vas.component';
import { DesfireFileComponent } from './modules/configure/desfire-file/desfire-file.component';
import { DesfireIdComponent } from './modules/configure/desfire-id/desfire-id.component';
import { Em4134MemoryComponent } from './modules/configure/em4134-memory/em4134-memory.component';
import { GoogleSmarttapComponent } from './modules/configure/google-smarttap/google-smarttap.component';
import { IdOnlyComponent } from './modules/configure/id-only/id-only.component';
import { Iso15693MemoryComponent } from './modules/configure/iso-15693-memory/iso-15693-memory.component';
import { MifareClassicComponent } from './modules/configure/mifare-classic/mifare-classic.component';
import { MifarePlusSl3Component } from './modules/configure/mifare-plus-sl3/mifare-plus-sl3.component';
import { MifareUltralightComponent } from './modules/configure/mifare-ultralight/mifare-ultralight.component';
import { NdefDataComponent } from './modules/configure/ndef-data/ndef-data.component';
import { OrangeNfcOfficeComponent } from './modules/configure/orange-nfc-office/orange-nfc-office.component';
import { OrangeNfcRetailComponent } from './modules/configure/orange-nfc-retail/orange-nfc-retail.component';
import { PanComponent } from './modules/configure/pan/pan.component';
import { SpringblueComponent } from './modules/configure/springblue/springblue.component';
import { LoggedInGuardService } from './modules/shared/services/logged-in-guard.service';

// Le contenu de ce fichier a été généré automatiquement
export const templatesRoutes: Routes = [
  {
    path: 'A78164Component',    component: A78164Component,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'AppleVasComponent',    component: AppleVasComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'DesfireFileComponent',    component: DesfireFileComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'DesfireIdComponent',    component: DesfireIdComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Em4134MemoryComponent',    component: Em4134MemoryComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'GoogleSmarttapComponent',    component: GoogleSmarttapComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'IdOnlyComponent',    component: IdOnlyComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'Iso15693MemoryComponent',    component: Iso15693MemoryComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'MifareClassicComponent',    component: MifareClassicComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'MifarePlusSl3Component',    component: MifarePlusSl3Component,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'MifareUltralightComponent',    component: MifareUltralightComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'NdefDataComponent',    component: NdefDataComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'OrangeNfcOfficeComponent',    component: OrangeNfcOfficeComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'OrangeNfcRetailComponent',    component: OrangeNfcRetailComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'PanComponent',    component: PanComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
  {
    path: 'SpringblueComponent',    component: SpringblueComponent,
    canActivate: [LoggedInGuardService],
    canDeactivate: [IsNotDirtyGuard],
  },
];
