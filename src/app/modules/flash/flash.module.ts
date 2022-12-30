import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { MatComponentsModule } from '@matcomponents/mat-components.module';
import { ApplicationService } from '@shared/services/application.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FirmwaresService } from '@shared/services/firmwares.service';
import { UtilitiesProvider } from '@shared/services/utilities.service';
import { HomeFlashComponent } from './home-flash/home-flash.component';
import { FlashHistoryComponent } from './flash-history/flash-history.component';
import { CsvDataService } from '@shared/services/csv.data.service';

@NgModule({
  imports: [CommonModule, MatComponentsModule, CoreModule, FormsModule],
  declarations: [HomeFlashComponent, FlashHistoryComponent],
  providers: [DialogsService, ApplicationService, FirmwaresService, UtilitiesProvider, CsvDataService],
})
export class FlashModule {}
