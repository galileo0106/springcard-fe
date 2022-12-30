// Contient les informations de l'utlisateur courant
export interface IMe {
  email: string;
  created: string; // @todo Date ?
  modified: string; // @todo Date ?
  last_connection: string;
  newsletter: boolean;
  products_used_for: string;
  first_name: string;
  last_name: string;
  company: string;
  phone: string;
  country: string | null;
  vat: string | null;
  is_admin_of_team: boolean;
  remaining_flash_count: number;
  can_flash_devices: boolean;
  user_account_type: string;
  configurations_count: number;
  devices_count: number;
  flash_count: number;
}
