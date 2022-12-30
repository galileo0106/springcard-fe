import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from './../../../environments/environment';

/**
 * Gros fourre-tout de fonctions globales
 */

// /!\ Toutes les URLs doivent se finir par un slash /!\
export const AppSettings = {
  ROOT_SERVICE_URL: environment.rootServiceUrl,
  WSS_URL: environment.wssUrl,
  BACKEND_URL: environment.backendUrl,
  FIRMWARES_LIST_URL: environment.firmwaresListUrl,
};

// Les hôtes et ports qu'il est possible de changer
export const AppSettingsOverWrite = {
  ROOT_SERVICE_URL: '',
  WSS_URL: '',
  BACKEND_URL: '',
  FIRMWARES_LIST_URL: '',
};

// Les informations sur l'utilisateur et sa machine (en provenance du service)
export const UserInformation = {
  MachineName: '',
  ComputerName: '',
  UserName: '',
};

// Retourne les informations de l'utilisateur (et de sa machine) recueuillies auprès du service au démarrage de l'application
export function getUserInformation() {
  return UserInformation;
}

// Met en place les informations de l'utilisateur (et de sa machine) recueuillies auprès du service au démarrage de l'application
export function setUserInformation(machineName: string, computerName: string, userName: string) {
  UserInformation.ComputerName = computerName;
  UserInformation.MachineName = machineName;
  UserInformation.UserName = userName;
}

// Est-ce que la clé nommée existe dans la localStorage (pour voir si un cheat code est en place) ?
export function hasCheatCode(keyName: string): boolean {
  return localStorage.getItem(keyName) !== null ? true : false;
}

// Retourne la valeur d'un champ d'un FormGroup ou null si le champ n'est pas trouvé
export function getFieldValue(form: UntypedFormGroup, fieldName: string): any {
  if (!form) {
    return null;
  }
  const field = form.get(fieldName);
  if (field) {
    return field.value;
  } else {
    return null;
  }
}

// Retourne le timeout (exprimé en ms) pour les appels au service (soit à partir de la localStorage soit à partir des préférences de l'environnement)
export function getTimeout() {
  const timeout = localStorage.getItem('sc_timeout');
  if (timeout) {
    return parseInt(timeout, 10);
  } else {
    return environment.timeout;
  }
}

export function getScriptorTimeout(): number {
  const timeout = localStorage.getItem('sc_timeout');
  if (timeout) {
    return parseInt(timeout, 10) * 3;
  } else {
    return environment.timeout * 3;
  }
}
/**
 * Recherche s'il y a des paramètres dans l'url pour changer l'hôte et les ports des services (Rest et Websoket)
 * et si ce n'est pas le cas, recherche dans la local storage.
 */
export function searchForAppSettings(activatedRoute: ActivatedRoute | null) {
  let serviceHost = null;
  if (activatedRoute != null) {
    serviceHost = activatedRoute.snapshot.queryParams['service-host'];
    const serviceApiPort = activatedRoute.snapshot.queryParams['service-api-port'];
    const serviceWsPort = activatedRoute.snapshot.queryParams['service-ws-port'];
    if (serviceHost != null) {
      if (serviceApiPort != null) {
        AppSettingsOverWrite.ROOT_SERVICE_URL = 'http://' + serviceHost + ':' + serviceApiPort + '/';
      }

      if (serviceWsPort !== null) {
        AppSettingsOverWrite.WSS_URL = 'ws://' + serviceHost + ':' + serviceWsPort;
      }
    }
  }

  if (serviceHost === null) {
    // S'il n'y a rien dans l'URL on va chercher dans la localstorage
    const ls_serviceHost = localStorage.getItem('sc_service-host');
    const ls_serviceApiPort = localStorage.getItem('sc_service-api-port');
    const ls_serviceWsPort = localStorage.getItem('sc_service-ws-port');
    const ls_backendUrl = localStorage.getItem('sc_backend-url');
    if (ls_backendUrl != null) {
      AppSettingsOverWrite.BACKEND_URL = ls_backendUrl;
    }
    if (ls_serviceHost != null) {
      if (ls_serviceApiPort != null) {
        AppSettingsOverWrite.ROOT_SERVICE_URL = 'http://' + ls_serviceHost + ':' + ls_serviceApiPort + '/';
      }

      if (ls_serviceWsPort !== null) {
        AppSettingsOverWrite.WSS_URL = 'ws://' + ls_serviceHost + ':' + ls_serviceWsPort;
      }
    }
  }
}

// Retourne une URL (celle du service, celle du back office, celle de la Websocket) en prenant en compte les surcharges
export function getServiceUrl(serviceName: string): string {
  searchForAppSettings(null);
  serviceName = serviceName.trim().toUpperCase();
  let retUrl = '';

  switch (serviceName) {
    case 'ROOT_SERVICE_URL':
      retUrl = AppSettingsOverWrite.ROOT_SERVICE_URL.trim() !== '' ? AppSettingsOverWrite.ROOT_SERVICE_URL : AppSettings.ROOT_SERVICE_URL;
      break;

    case 'WSS_URL':
      retUrl = AppSettingsOverWrite.WSS_URL.trim() !== '' ? AppSettingsOverWrite.WSS_URL : AppSettings.WSS_URL;
      break;

    case 'BACKEND_URL':
      retUrl = AppSettingsOverWrite.BACKEND_URL.trim() !== '' ? AppSettingsOverWrite.BACKEND_URL : AppSettings.BACKEND_URL;
      break;

    case 'FIRMWARES_LIST_URL':
      retUrl = AppSettings.FIRMWARES_LIST_URL;
      break;

    case 'MODELS_URL':
      retUrl = 'https://models.springcard.com/api/';
      break;

    default:
      retUrl = AppSettingsOverWrite.ROOT_SERVICE_URL.trim() !== '' ? AppSettingsOverWrite.ROOT_SERVICE_URL : AppSettings.ROOT_SERVICE_URL;
      break;
  }
  return retUrl;
}

// Conversion d'une date au format ISO 8601 vers une date JS
export function fromIso8601toJsDate(isoDate: string, withTime: boolean): Date {
  const year = parseInt(isoDate.substr(0, 4), 10);
  const month = parseInt(isoDate.substr(5, 2), 10) - 1;
  const day = parseInt(isoDate.substr(8, 2), 10);
  let returnDate = new Date();
  if (withTime) {
    const hours = parseInt(isoDate.substr(11, 2), 10);
    const minutes = parseInt(isoDate.substr(14, 2), 10);
    const seconds = parseInt(isoDate.substr(17, 2), 10);
    const milliseconds = 0;
    returnDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
  } else {
    returnDate = new Date(Date.UTC(year, month, day));
  }
  return returnDate;
}

export function doWeUseWebsocket(): boolean {
  const lsValue = localStorage.getItem('sc_websocket');
  if (lsValue === null) {
    return true;
  }
  return lsValue.trim().toLowerCase() === 'false' ? false : true;
}

// Génère un UUID
export function UUID(): string {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  let str = '';
  for (let i = 0; i < array.length; i++) {
    str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
  }
  return str;
}
