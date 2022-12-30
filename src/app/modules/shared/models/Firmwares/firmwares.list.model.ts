export interface IFirmwareToDownload {
  id: number;
  Vendor: string;
  Product: string;
  Firmware: string;
  Version: string;
  Revision: string;
  BuildDate: string;
  Filename: string;
  IsPublic: boolean;
  Description?: string;
  Numericalversion: number;
}
