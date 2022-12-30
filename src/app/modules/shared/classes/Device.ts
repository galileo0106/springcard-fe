import { IDevicePcsc } from '@shared/models/Pcsc/device.Pcsc.model';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { Devices } from './Devices';
import LatestFirmwaresVersions from '../../../../assets/firmwares.json';

/**
 * Représente un péripjérique détecté (depuis le service de SC Companion)
 */
export class Device {
  private _deviceFromServer: IDeviceResponse; // L'objet Device reçu par le service dans la tray

  // Toutes les propriétés publiques de la classe qui sont valorisées avec le contenu de this._deviceFromServer
  DeviceId: string;
  Name: string;
  FriendlyName?: string;
  Channel: string;
  Profile: string;
  Status: string;
  PnpId: string;
  Mode: string;
  VendorId: number;
  ProductId: number;
  SerialNumber?: string;
  Version: string;
  Firmware?: string;
  UniqueId: string;
  ConfigId?: string;
  Hardware?: string;
  Characteristics?: string;
  Pcsc?: IDevicePcsc[];
  HidInstance?: string;
  CommPort?: string[];
  PhysAddress?: string;
  IpAddress?: string;
  IpAddress6?: string;
  NumericalVersion: number;
  Location?: string;
  Inventory: string;
  LastConfigurationId?: number;
  Binding?: string;

  constructor(deviceFromServer: any) {
    this._deviceFromServer = deviceFromServer;
    Object.assign(this, deviceFromServer); // Assignation automatique des propriétés de l'objet Device reçu aux propriétés de la classe
    this.NumericalVersion = this.getNumericalVersion();
    this.LastConfigurationId = 0;
  }

  public set lastConfigurationId(configurationId: number) {
    this.LastConfigurationId = configurationId;
  }

  public get lastConfigurationId(): number {
    return this.LastConfigurationId ?? 0;
  }

  // Est-ce que le produit détecté fait partie des produits connus ?
  public isThisAKnownProduct(): boolean {
    const devices = new Devices();
    devices.setDataFromServer(this._deviceFromServer);
    return devices.isDeviceSupported();
  }

  // Est-ce que le périphérique courant dispose de registres individuels (d'après sa définition) ?
  public hasIndividualsRegisters(): boolean {
    const devices = new Devices();
    devices.setDataFromServer(this._deviceFromServer);
    return devices.deviceHasIndividualRegisters();
  }

  // Est-ce qu'il existe une MAJ du firmware pour ce produit ?
  public deviceHasAFirmwareUpdate(): boolean {
    if (this.Name.trim() === '') {
      return false;
    }

    for (const latest of LatestFirmwaresVersions) {
      if (latest.title.trim().toLowerCase() === this.Name.trim().toLowerCase()) {
        const currentVersion = this.getNumericalVersion();
        if (latest.hasOwnProperty('latest_numerical_version') && latest.latest_numerical_version && currentVersion > 0) {
          if (latest.latest_numerical_version > currentVersion) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Retourne la version courante du firmware (sous une forme numérique)
  public getNumericalVersion(): number {
    if (this.Version.trim() === '') {
      return 0;
    }
    const parts = this.Version.trim().split('.');
    if (parts.length < 2) {
      return 0;
    }

    let major = 0;
    let minor = 0;
    let revision = 0;
    if (parts.length === 3) {
      major = parseInt(parts[0], 10);
      minor = parseInt(parts[1], 10);
      revision = parseInt(parts[2], 10);
    } else if (parts.length === 2) {
      major = parseInt(parts[0], 10);
      minor = parseInt(parts[1], 10);
    } else {
      return 0;
    }
    return major * 10000 + minor * 100 + revision;
  }

  // Retourne l'URL (interne) à utiliser, pour configurer le péripérique (ce qui correspond au nom du composant)
  public getDeviceConfigurationUrl(): string | null {
    const devices = new Devices();
    devices.setDataFromServer(this._deviceFromServer);
    if (!devices.isDeviceSupported()) {
      console.error("We can't find the device component because this device is unknown");
      return null;
    }
    const device = devices.getDeviceFromServiceData();
    return device === null ? null : device.component;
  }

  // Est-ce que le périphérique courant est en mode 'reader'
  public isInReaderMonde(): boolean {
    if (!this._deviceFromServer.Mode) {
      return false;
    }
    const deviceMode = this._deviceFromServer.Mode.trim().toLowerCase();
    return deviceMode === 'reader' || deviceMode === 'pc/sc' || deviceMode === 'direct' ? true : false;
  }
}
