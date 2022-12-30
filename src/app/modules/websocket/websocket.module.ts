import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@core/core.module';
import { MatComponentsModule } from '@matcomponents/mat-components.module';
import { ApplicationService } from '@shared/services/application.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { WsService } from '@shared/services/ws.service';
import { WsmessagesService } from '@shared/services/wsmessages.service';
import { AlleventsComponent, DialogAllEventsEventDataDialog } from './allevents/allevents.component';
import { DialogEventDataDialog, WseventsComponent } from './wsevents/wsevents.component';

@NgModule({
  imports: [CommonModule, MatComponentsModule, CoreModule],
  declarations: [WseventsComponent, DialogEventDataDialog, DialogAllEventsEventDataDialog, AlleventsComponent],
  providers: [WsService, WsmessagesService, DialogsService, ApplicationService],
})
export class WebsocketModule {}
