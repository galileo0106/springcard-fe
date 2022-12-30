/**
 * Contenu du formulaire pour créer un compte (via email/mot de passe)
 */
export interface IRegisterUser {
  first_name?: string;
  last_name?: string;
  company?: string;
  email: string;
  password: string;
  newsletter: number;
  products_used_for: string;
  phone: string;
  country: string;
  vat?: string;
}
