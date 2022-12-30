/**
 * Contains all the details of a configuration
 */
export interface IConfigurationDetails {
  id: number;
  title: string;
  guid?: string;
  description?: string;
  created: Date;
  modified?: Date;
  favorites: boolean;
  configuration: string;
  device_configuration: string;
  created_from: number | string;
  product_title: string;
  product_firmware: string;
  product_hardware: string;
}
