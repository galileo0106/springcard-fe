import { IPlansOptionAccessPerPlan } from './iplansoptionaccessperplan.model';

export interface IPlansOptionsLabels {
  key: string;
  label: string;
  access: IPlansOptionAccessPerPlan[];
}
