/**
 * Liste des produits d'un utilisateur
 */
export interface IUserProducts {
  UniqueId: string;
  last_seen: string;
  created: string;
  ConfigId: string;
  version: string;
  numericalversion: number;
  inventory: string;
  location: string;
  frozen_firmware: boolean;
  product_title: string;
  product_firmware: string;
  product_hardware: string;
}
