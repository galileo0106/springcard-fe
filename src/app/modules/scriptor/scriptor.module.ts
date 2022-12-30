import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { MatComponentsModule } from '@matcomponents/mat-components.module';
import { ApduHistoryService } from '@shared/services/apdu.history.service';
import { ApduParserService } from '@shared/services/apduparserservice.service';
import { ApplicationService } from '@shared/services/application.service';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { ModelsService } from '@shared/services/models.service';
import { PcScService } from '@shared/services/pcscservice.service';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { ScriptorComponent } from './scriptor/scriptor.component';

@NgModule({
  declarations: [ScriptorComponent],
  imports: [CommonModule, CoreModule, FormsModule, MatComponentsModule, RouterModule, KeyboardShortcutsModule.forRoot()],
  providers: [
    DialogsService,
    ApplicationService,
    PcScService,
    ModelsService,
    DeviceInformationsButtonsService,
    ApduParserService,
    ApduHistoryService,
  ],
})
export class ScriptorModule {}
