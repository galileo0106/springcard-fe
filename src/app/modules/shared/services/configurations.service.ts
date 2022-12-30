import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getServiceUrl, getTimeout } from '@shared/appSettings';
import { IndividualsMethod } from '@shared/classes/ProductConfiguration';
import { IConfigurationApplied } from '@shared/models/Configuration/configuration.applied.model';
import { IConfigurationDetails } from '@shared/models/Configuration/configuration.details.models';
import { IConfigurationList } from '@shared/models/Configuration/configuration.list.model';
import { IConfigurationSummary } from '@shared/models/Configuration/configuration.summary.model';
import { IConfigurationWriteResponse } from '@shared/models/Configuration/configuration.write.response.model';
import { IConfigurationToSaveResponse } from '@shared/models/Configuration/configurations.to.save.response.model';
import { IConfigurationToSave } from '@shared/models/Configuration/configurationto.save.model';
import { IDeviceConfigurationRequest } from '@shared/models/Configuration/device.configuration.model';
import { IIndividualsConfigurationLog } from '@shared/models/Configuration/iindividuals.configuration.log.model';
import { IJsonSuccessResponse } from '@shared/models/ijson.success.response.model';
import { IProductsConfigurationList } from '@shared/models/Configuration/IProductsConfigurationList.model';
import { IJsonResponse } from '@shared/models/jsonresponse.model';
import { Observable } from 'rxjs';
import { shareReplay, timeout } from 'rxjs/operators';

export interface IDeviceSpecificRegister {
  [key: string]: string;
}

/**
 * Gère les interactions avec le back office pour les configurations utilisateur.
 * (récupérer toutes les configurations, une configuration, en ajouter une, en éditer une, en supprimer une, etc)
 */
@Injectable()
export class ConfigurationsService {
  constructor(private http: HttpClient) {}

  public getConfigurations(filterProductId: number | null, filterFavorites: boolean | null): Observable<IConfigurationList[]> {
    let httpParams = new HttpParams();
    if (filterProductId !== null) {
      httpParams = httpParams.append('productId', filterProductId.toString());
    }
    if (filterFavorites !== null) {
      httpParams = httpParams.append('favorites', filterFavorites.toString());
    }
    const route = getServiceUrl('BACKEND_URL') + 'configurations';
    return this.http.get<IConfigurationList[]>(route, { params: httpParams });
  }

  public getProductsConfigurationList(): Observable<IProductsConfigurationList[]> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/productslist';
    return this.http.get<IProductsConfigurationList[]>(route);
  }

  public getConfiguration(configurationId: number): Observable<IConfigurationDetails> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/' + configurationId;
    return this.http.get<IConfigurationDetails>(route);
  }

  // prettier-ignore
  public writeConfigurationInDevice(configuration: string, deviceId: string, specific: IndividualsMethod): Observable<IConfigurationWriteResponse> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/config';
    let httpParams = new HttpParams();
    httpParams = httpParams.append('specific', specific);
    // prettier-ignore
    return this.http.put<IConfigurationWriteResponse>(route, configuration, { params: httpParams }).pipe(timeout(getTimeout()));
  }

  public saveConfiguration(configuration: IConfigurationToSave): Observable<IConfigurationToSaveResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations';
    return this.http.post<IConfigurationToSaveResponse>(route, configuration).pipe(shareReplay());
  }

  public favUnfavConfiguration(configurationId: number, favoriteStatus: boolean): Observable<IConfigurationWriteResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/favunfav';
    return this.http.post<IConfigurationWriteResponse>(route, { id: configurationId, favorite: favoriteStatus });
  }

  public shareConfiguration(configurationId: number, recipient: string): Observable<IConfigurationToSaveResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/share';
    return this.http.post<IConfigurationToSaveResponse>(route, { id: configurationId, email: recipient }).pipe(shareReplay());
  }

  public duplicateConfiguration(configurationId: number, title: string, description?: string): Observable<IConfigurationToSaveResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/duplicate';
    return this.http.post<IConfigurationToSaveResponse>(route, { id: configurationId, title, description }).pipe(shareReplay());
  }

  public updateConfiguration(configuration: IConfigurationToSave, configurationId: number): Observable<IConfigurationToSaveResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/' + configurationId;
    return this.http.put<IConfigurationToSaveResponse>(route, configuration); // .pipe(shareReplay());
  }

  public deleteConfiguration(configurationId: number): Observable<IConfigurationWriteResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/' + configurationId;
    return this.http.delete<IConfigurationWriteResponse>(route).pipe(shareReplay());
  }

  public saveConfigurationApplied(configurationApplied: IConfigurationApplied): Observable<IJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'configurationsapplied';
    return this.http.post<IJsonResponse>(route, configurationApplied).pipe(shareReplay());
  }

  // Retourne la liste des configurations d'un utilisateur pour un périphérique donné
  public getMyConfigurationForDevice(requestedDevice: IDeviceConfigurationRequest): Observable<IConfigurationSummary[]> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/device';
    return this.http.post<IConfigurationSummary[]>(route, requestedDevice).pipe(shareReplay());
  }

  // Retourne la liste (avec leur valeur) des registres individuels d'un périphérique
  public getDeviceSpecificRegistersValues(deviceId: string): Observable<IDeviceSpecificRegister> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/config/specific';
    return this.http.get<IDeviceSpecificRegister>(route);
  }

  // [Configure les registres individuels d'un lecteur](https://docs.springcard.com/books/Companion/REST_API/Devices/Routes/Configuration/Config_Specific_(Put))
  // prettier-ignore
  public writeDeviceIndividualRegisters(configuration: string, deviceId: string): Observable<IConfigurationWriteResponse> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/config/specific';
    // prettier-ignore
    return this.http.put<IConfigurationWriteResponse>(route, configuration).pipe(timeout(getTimeout()));
  }

  // Envoi d'un log suite à la configuration des registres individuels
  public logIndividualsConfigured(log: IIndividualsConfigurationLog): Observable<IJsonSuccessResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/individuals';
    return this.http.post<IJsonSuccessResponse>(route, log).pipe(shareReplay());
  }

  // Retourne la liste des configurations d'un utilisateur membre d'une équipe
  public getTeamUserConfigurationsList(email: string): Observable<IConfigurationList[]> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/member/list/' + email;
    return this.http.get<IConfigurationList[]>(route);
  }

  // Demande l'import d'une configuration d'un autre utilisateur membre de la même équipe
  public importTeamMemberConfiguration(configurationId: number): Observable<IConfigurationToSaveResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'configurations/member/import/' + configurationId;
    return this.http.get<IConfigurationToSaveResponse>(route).pipe(shareReplay());
  }
}
