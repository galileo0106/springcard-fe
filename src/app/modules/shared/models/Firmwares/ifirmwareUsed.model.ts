// Informations envoyées au back office suite à la MAJ d'un firmware
export interface IFirmwareUsed {
  Firmware?: string;
  Hardware?: string;
  Name?: string;
  firmware_meta_id?: number;
  success?: boolean;
  reason?: string;
  service_Vendor?: string;
  service_Product?: string;
  service_Firmware?: string;
  service_Version?: string;
  service_Revision?: string;
  service_BuildDate?: string;
  UniqueId: string;
  Version?: string;
  NumericalVersion?: number;
  Location?: string;
  Inventory?: string;
  Profile?: string;
  Mode?: string;
  MachineName?: string;
  ComputerName?: string;
  UserName?: string;
}
