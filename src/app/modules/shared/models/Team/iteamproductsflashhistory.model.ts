/**
 * Historique des flash des produits d'une équipe
 */
export interface ITeamProductsFlashHistory {
  flashed_at: string;
  success: boolean;
  reason: string;
  local_Vendor: string;
  local_Product: string;
  local_Firmware: string;
  local_Version: string;
  local_Revision: string;
  local_BuildDate: string;
  Vendor?: string;
  Product?: string;
  Firmware?: string;
  Version?: string;
  Revision?: string;
  BuildDate?: string;
  Filename?: string;
  numericalversion?: number;
  UniqueId: string;
  ConfigId: string;
  email: string;
  first_name: string;
  last_name: string;
}
