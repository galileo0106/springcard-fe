import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { MatComponentsModule } from '@matcomponents/mat-components.module';
import { ApplicationService } from '@shared/services/application.service';
import { CsvDataService } from '@shared/services/csv.data.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { CardAnalysisComponent } from './card-analysis/card-analysis.component';
import { DetectionService } from './detection.service';
import { HomeDetectionComponent } from './home-detection/home-detection.component';
import { TeamProductsComponent } from './team-products/team-products.component';

/**
 * Detect devices attached to current computer or that can be found via this computer
 */
@NgModule({
  imports: [CommonModule, MatComponentsModule, RouterModule, CoreModule],
  declarations: [HomeDetectionComponent, CardAnalysisComponent, TeamProductsComponent],
  exports: [HomeDetectionComponent],
  providers: [DetectionService, DialogsService, ApplicationService, CsvDataService],
})
export class DetectionModule { }
