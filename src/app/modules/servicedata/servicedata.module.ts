import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@core/core.module';
import { MatComponentsModule } from '@matcomponents/mat-components.module';
import { ApplicationService } from '@shared/services/application.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { ServiceDataComponent } from './servicedata/servicedata.component';

/**
 * Manage the display of information about the service
 */
@NgModule({
  imports: [CommonModule, MatComponentsModule, CoreModule],
  declarations: [ServiceDataComponent],
  exports: [],
  providers: [DialogsService, ApplicationService],
})
export class ServiceDataModule {}
