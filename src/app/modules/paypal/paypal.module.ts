import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelComponent } from './cancel/cancel.component';
import { ReturnComponent } from './return/return.component';
import { RouterModule } from '@angular/router';
import { PaypalService } from '@shared/services/paypal.service';
import { CoreModule } from '@core/core.module';
import { MatComponentsModule } from '@matcomponents/mat-components.module';

@NgModule({
  declarations: [CancelComponent, ReturnComponent],
  imports: [CoreModule, MatComponentsModule, CommonModule, RouterModule],
  providers: [PaypalService],
})
export class PaypalModule {}
