import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getServiceUrl, getTimeout } from '@shared/appSettings';
import { Device } from '@shared/classes/Device';
import { IDeviceResponse } from '@shared/models/Device/device.response.model';
import { IDeviceSeen } from '@shared/models/Device/device.seen.model';
import { IDevicesSeenConfigurations } from '@shared/models/Configuration/idevicesseenconfigurations';
import { ITeamUsersProducts } from '@shared/models/Team/iteamusersproducts.model';
import { IUserProducts } from '@shared/models/User/iuserproducts.model';
import { IServiceSettings } from '@shared/models/iservicesettings.model';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { IJsonResponse } from '@shared/models/jsonresponse.model';

/**
 * Service utilisé pour tout ce qui est relatif à la détection du matériel
 */
@Injectable()
export class DetectionService {
  constructor(private http: HttpClient) {}

  // Retourne la liste de tous les périphériques détectés
  getDevicesList() {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'devices';
    return this.http.get<IDeviceResponse[]>(route).pipe(
      timeout(getTimeout()),
      map((devices) => {
        const result: Device[] = [];
        devices.forEach((device) => {
          const deviceObject = new Device(device);
          result.push(deviceObject);
        });
        return result;
      }),
    );
  }

  //add binding
  addBinding(deviceId: string): Observable<IJsonResponse> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/bind';
    return this.http.put<IJsonResponse>(route ,{});
  }
  deleteBinding(deviceId: string): Observable<IJsonResponse> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/bind';
    return this.http.delete<IJsonResponse>(route);
  }

  getServiceSettings() {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'service/settings';
    return this.http.get<IServiceSettings>(route);
  }

  // Retourne les informations sur un périphérique spécifique
  getDevice(deviceId: string): Observable<IDeviceResponse> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId;
    return this.http.get<IDeviceResponse>(route).pipe(timeout(getTimeout()));
  }

  sendUserDevicesSeen(deviceList: IDeviceSeen[]): Observable<IDevicesSeenConfigurations> {
    const route = getServiceUrl('BACKEND_URL') + 'users/products';
    return this.http.post<IDevicesSeenConfigurations>(route, deviceList);
  }

  // Retourne la liste des produits d'un utilisateur membre d'une équipe
  public getTeamUserProductsList(email: string): Observable<IUserProducts[]> {
    const route = getServiceUrl('BACKEND_URL') + 'teams/products/' + email;
    return this.http.get<IUserProducts[]>(route);
  }

  public getAllTeamUsersProductsList(): Observable<ITeamUsersProducts[]> {
    const route = getServiceUrl('BACKEND_URL') + 'teams/products';
    return this.http.get<ITeamUsersProducts[]>(route);
  }

  public getSerialPorts(): Observable<any[]> {
    const route = getServiceUrl('ROOT_SERVICE_URL') +  'utilities/list-serial-ports';
    return this.http.get<any[]>(route);
  }

  public getNetworkDevices(ipAddress: string): Observable<any[]> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'lookup/begin';
    console.log(ipAddress);
    return this.http.post<any[]>(route, {channel: 'virtual', timeout: 10});
    // return this.http.post<any[]>(route, {channel: 'network', timeout: 10});
  }

  public getSerialDevices(serialPort: string): Observable<any[]> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'lookup/begin';
    console.log(serialPort)
    return this.http.post<any[]>(route, {channel: 'virtual', timeout: 10});
    // return this.http.post<any[]>(route, {channel: 'serial', SerialPort: serialPort})
  }

}
