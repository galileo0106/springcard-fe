/**
 * Permet de logger que les registres individuels d'un produit ont été configurés
 */
export interface IIndividualsConfigurationLog {
  UniqueId: string;
  Firmware?: string;
  Hardware?: string;
  Name: string;
  Version: string;
  NumericalVersion: number;
  Profile: string;
  Mode: string;
  MachineName: string;
  ComputerName: string;
  UserName: string;
  Location?: string;
  Inventory?: string;
}
