import { IProjectComponentConfiguration } from './Configuration/IProjectComponentConfiguration.models';

export interface IProject {
  id: number; // ID de la configuration dans le back office
  ConfigId?: string; // L'identifiant de configuration renvoyé par le service
  created: Date; // Date de création du projet
  loaded?: Date; // Date à laquelle on a (re)chargé le projet
  component: string; // Nom du composant du périphérique
  nfcTemplates: string[]; // Liste des composants des templates NFC
  bleTemplates: string[]; // Liste des composants des template BLE
  configurations: IProjectComponentConfiguration[]; // Configurations par composant (configuration du composant du périphérique ET des templates)
  deviceId: string; // L'ID du périphérique qu'on a configuré
  configurationName: string;
  configurationDescription: string;
  configurationIsFavorite: boolean;
}
