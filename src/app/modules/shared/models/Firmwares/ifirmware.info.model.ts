// Informations sur un fichier local de firmware (infos retournées par le service)
export interface IFirmwareInfo {
  Vendor: string;
  Product: string;
  Firmware: string;
  Version: string;
  Revision: string;
  BuildDate: string;
}
