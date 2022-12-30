import { Routes } from '@angular/router';
import { DetectionModule } from './detection.module';

export const detectionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DetectionModule,
      } /*,
            {
                path: ':id',
                component: DeviceDetailComponent
            }*/,
    ],
  },
];
