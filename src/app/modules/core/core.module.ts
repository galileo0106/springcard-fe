import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatComponentsModule } from '@matcomponents/mat-components.module';
import { DisplayablejsonPipe } from '@shared/pipes/displayablejson.pipe';
import { HexadecimalPipe } from '@shared/pipes/hexadecimal.pipe';
import { Iso8601toJsDate } from '@shared/pipes/iso8601toJsDate.pipe';
import { JsonToArrayPipe } from '@shared/pipes/json-to-array.pipe';
import { NaPipe } from '@shared/pipes/na.pipe';
import { YesNoPipe } from '@shared/pipes/yesno.pipe';
import { ControlService } from '@shared/services/control.service';
import { SettingsService } from '@shared/services/settings.service';
import { OverLimitComponent } from '../../over-limit/over-limit.component';
import { DeviceInformationsComponent } from './device-informations/device-informations.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

/**
 * Module used to share project's dependencies ("SharedModule")
 */
@NgModule({
  imports: [CommonModule, MatComponentsModule],
  exports: [
    PageNotFoundComponent,
    HexadecimalPipe,
    NaPipe,
    JsonToArrayPipe,
    DisplayablejsonPipe,
    Iso8601toJsDate,
    YesNoPipe,
    DeviceInformationsComponent,
    OverLimitComponent,
  ],
  declarations: [
    PageNotFoundComponent,
    HexadecimalPipe,
    NaPipe,
    JsonToArrayPipe,
    DisplayablejsonPipe,
    Iso8601toJsDate,
    YesNoPipe,
    DeviceInformationsComponent,
    OverLimitComponent,
  ],
  providers: [ControlService, SettingsService],
})
export class CoreModule {}
