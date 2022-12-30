export interface IProjectComponentConfiguration {
  component: string; // Nom du composant auquel se réfère la configuration ci-dessous
  form: string; // Configuration au format Angular (FormGroup)
  registers: string; // Configuration calculée des registres (0202 = 650A32...)
  slot: number; // Slot du template sinon -1 pour le composant du lecteur et -2 pour le formulaire de paramétrage de la configuration
}
