// Patron des données qui se trouvent dans templatesList.ts
export interface ITemplatesList {
  id: string;
  title: string;
  description: string;
  component: string;
  isBleTemplate: boolean;
  selector: string;
  lkl: ILkl[];
}

export interface ILkl {
  value: string;
  title: string;
}
