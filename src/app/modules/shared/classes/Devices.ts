import { DevicesList } from '@configurations/devicesList';
import { IDeviceList } from '@shared/models/Device/device.list.model';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';

/**
 * Classe destinée à faciliter la recherche d'un périphérique dans la liste des périphériques connus
 */
export class Devices {
  private devicesList: IDeviceList[] = DevicesList;
  private _deviceFromServer: IDeviceResponse;

  // Met en place les données récupérées sur le périphérique depuis le service de SC Companion
  setDataFromServer(data: IDeviceResponse) {
    this._deviceFromServer = data;
  }

  // Est-ce que le périphérique, qui a été passé à setDataFromServer() dispose de registres individuels ?
  deviceHasIndividualRegisters(): boolean {
    const device = this.searchDeviceFromServiceData();
    if (device === null) {
      return false;
    }
    return device.individuals.length > 0 ? true : false;
  }

  // Supprime des champs une éventuelle version qui se présenterait sous la forme XXX-VV
  private removeVersionFromName(name: string): string {
    const minusPosition = name.lastIndexOf('-');
    if (minusPosition !== -1) {
      name = name.substring(0, minusPosition);
    }
    return name;
  }

  // Recherche d'un périphérique à partir des données reçues du service
  private searchDeviceFromServiceData(): IDeviceList | null {
    //console.info("== Trying to identify the following device ==");

    if (this._deviceFromServer.Name === undefined) {
      console.error("We can't identify the device because all required fields are empty!");
      return null;
    }

    // prettier-ignore
    const deviceFirmware = (this._deviceFromServer.Firmware !== undefined && this._deviceFromServer.Firmware !== null) ? this._deviceFromServer.Firmware.trim().toLowerCase() : '';
    // prettier-ignore
    const deviceHardware = (this._deviceFromServer.Hardware !== undefined && this._deviceFromServer.Hardware !== null) ? this.removeVersionFromName(this._deviceFromServer.Hardware.trim().toLowerCase()) : '';
    // prettier-ignore
    const deviceName = (this._deviceFromServer.Name !== undefined && this._deviceFromServer.Name !== null) ? this._deviceFromServer.Name.trim().toLowerCase() : '';

    const devicesFound: IDeviceList[] = [];

    for (const device of this.devicesList) {
      if (deviceName !== '') {
        if (device.title.toLowerCase().trim() === deviceName) {
          devicesFound.push(device);
        }
      } else if (deviceFirmware !== '') {
        if (device.firmware.toLowerCase().trim() === deviceFirmware) {
          devicesFound.push(device);
        }
      } else if (deviceHardware !== '') {
        if (device.hardware.toLowerCase().trim() === deviceHardware) {
          devicesFound.push(device);
        }
      } else {
        console.error("Device can't be found because we don't have any required field to identify it.");
      }
    }

    if (devicesFound.length === 0) {
      //console.error("Device not found!");
      return null;
    } else if (devicesFound.length === 1) {
      //console.info("One device found");
      return devicesFound[0];
    } else {
      //console.info("Multiple devices found");
      for (const device of devicesFound) {
        if (device.title.trim().toLowerCase() === deviceName) {
          //console.info("One device found");
          return device;
        }
      }
    }
    console.error('Device not found!');
    return null;
  }

  /**
   * Est-ce que le périphérique dont on passe les données recues du service est connu du système ?
   */
  isDeviceSupported(): boolean {
    const device = this.searchDeviceFromServiceData();
    return device === null ? false : true;
  }

  /**
   * Retourne la définition d'un périphérique depuis la liste des périphériques connus à partir des données du service
   */
  getDeviceFromServiceData(): IDeviceList | null {
    return this.searchDeviceFromServiceData();
  }

  /**
   * Retourne la définition d'un périphérique à partir du nom de son composant Angular
   *
   * @param componentName Le nom du composant
   */
  getDeviceFromComponent(componentName: string): IDeviceList | null {
    componentName = componentName.trim().toLowerCase();
    for (const device of this.devicesList) {
      if (device.component.trim().toLowerCase() === componentName) {
        return device;
      }
    }
    return null;
  }

  getDeviceFromFirmwareAndTitle(firmware: string, title: string): IDeviceList | null {
    if (title !== null) {
      title = title.trim().toLowerCase();
    }
    if (firmware) {
      firmware = firmware.trim().toLowerCase();
    }
    this._deviceFromServer = {
      DeviceId: '',
      Name: title,
      Channel: '',
      Profile: '',
      Status: '',
      PnpId: '',
      Mode: '',
      VendorId: 7220,
      ProductId: 24880,
      Version: '',
      Firmware: firmware,
      UniqueId: '',
    };
    return this.searchDeviceFromServiceData();
  }
}
