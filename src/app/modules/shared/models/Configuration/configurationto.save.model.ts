/**
 * Describes a user configuration that needs to be saved
 */
export interface IConfigurationToSave {
  title: string;
  description?: string;
  Firmware: string;
  Hardware?: string;
  Name?: string;
  configuration: string;
  device_configuration: string;
  UniqueId?: string;
  ConfigId?: string;
  favorites: boolean;
}
