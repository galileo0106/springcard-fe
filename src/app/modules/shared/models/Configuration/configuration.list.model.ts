/**
 * Liste des configurations
 */
export interface IConfigurationList {
  id: number;
  title: string;
  description: string;
  created: Date;
  modified: Date;
  favorites: boolean;
  author: string;
  hash: string;
  product_title: string;
  product_firmware: string;
  product_hardware: string;
}
