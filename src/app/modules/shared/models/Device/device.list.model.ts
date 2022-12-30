// Patron des données qui se trouvent dans devicesList.ts
export interface IDeviceList {
  outputBase: string;
  component: string;
  title: string;
  implements: string;
  path: string;
  firmware: string;
  hardware: string;
  version: string;
  author: string;
  templatesNfc: boolean;
  templatesBle: boolean;
  individuals: string[];
}
