/**
 * Résumé d'une configuration
 */
export interface IConfigurationSummary {
  id: number;
  title: string;
  description: string;
  created: string;
  modified: string;
  author: string;
  hash: string;
  product_title: string;
  product_firmware: string;
  product_hardware: string;
  favorites: boolean;
}
