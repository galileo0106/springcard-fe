import { IPlanAccess } from './iplanaccess.model';

// Patron des données qui se trouvent dans plans.list.ts
export interface IPlansList {
  key: string;
  label: string;
  summary: string;
  description: string;
  pricePerMonth: number;
  pricePerYear: number;
  upgradeTo: string;
  downgradeTo: string;
  access?: IPlanAccess[];
}
