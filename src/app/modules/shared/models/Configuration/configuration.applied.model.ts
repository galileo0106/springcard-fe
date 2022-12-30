/**
 * Do we succeed to write the configuration to the device?
 */
export interface IConfigurationApplied {
  success: boolean;
  Firmware?: string;
  Hardware?: string;
  Name?: string;
  configuration_id: number;
  ConfigId?: string;
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
