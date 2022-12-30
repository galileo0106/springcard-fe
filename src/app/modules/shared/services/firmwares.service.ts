import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getServiceUrl, getTimeout } from '@shared/appSettings';
import { IBlob } from '@shared/models/filename.model';
import { IFirmwareDownload } from '@shared/models/Firmwares/firmware.download.model';
import { IFirmwareToDownload } from '@shared/models/Firmwares/firmwares.list.model';
import { IFirmwareInfo } from '@shared/models/Firmwares/ifirmware.info.model';
import { IFirmwareUsed } from '@shared/models/Firmwares/ifirmwareUsed.model';
import { IGetProductFirmwaresList } from '@shared/models/Firmwares/igetproductfirmwareslist.model';
import { IProductFlashHistory } from '@shared/models/Flash/iproductflashhistory.model';
import { IJsonSuccessResponse } from '@shared/models/ijson.success.response.model';
import { ITeamProductsFlashHistory } from '@shared/models/Team/iteamproductsflashhistory.model';
import { IUserProducts } from '@shared/models/User/iuserproducts.model';
import { Observable } from 'rxjs';
import { shareReplay, timeout } from 'rxjs/operators';

/**
 * Manage everything related to firmwares (get list of firmwares, load firmware into device, etc)
 */
@Injectable()
export class FirmwaresService {
  public firmwares: any[];

  constructor(private http: HttpClient) {}

  // Retourne la liste des firmwares applicables à un produit
  getFirmwaresList(product: IGetProductFirmwaresList): Observable<IFirmwareToDownload[]> {
    const route = getServiceUrl('BACKEND_URL') + 'firmwares/product';
    return this.http.post<IFirmwareToDownload[]>(route, product).pipe(shareReplay());
  }

  // Demande le téléchargement d'un firmware depuis le back office
  downloadFirmware(firmwareInformation: IFirmwareDownload) {
    const route = getServiceUrl('BACKEND_URL') + 'firmwares/download';
    return this.http.post(route, firmwareInformation, { responseType: 'text' }).pipe(timeout(getTimeout()), shareReplay());
  }

  // Envoi d'un firmware (sous la forme d'un blob) au service
  loadFirmware(deviceId: string, firmwareBlob: string): Observable<any> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'device/' + deviceId + '/load-firmware';
    return this.http.post<IBlob>(route, { Blob: firmwareBlob }).pipe(timeout(getTimeout()));
  }

  firmwareUsed(firmwareInformation: IFirmwareUsed): Observable<IJsonSuccessResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'firmwaresused';
    return this.http.post<IJsonSuccessResponse>(route, firmwareInformation).pipe(timeout(getTimeout()));
  }

  // Permet de valider un fichier local de firmware (auprès du service)
  validateLocalFirmwareFile(firmwareBlob: string): Observable<any> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'utilities/firmware-info';
    return this.http
      .post<IFirmwareInfo>(route, { Blob: firmwareBlob }) // IBlob
      .pipe(timeout(getTimeout()));
  }

  productsFlashedList(email: string): Observable<IUserProducts[]> {
    const route = getServiceUrl('BACKEND_URL') + 'firmwaresused/products/' + email;
    return this.http.get<IUserProducts[]>(route).pipe(timeout(getTimeout()));
  }

  productFlashHistory(UniqueId: string): Observable<IProductFlashHistory[]> {
    const route = getServiceUrl('BACKEND_URL') + 'firmwaresused/history/' + UniqueId;
    return this.http.get<IProductFlashHistory[]>(route).pipe(timeout(getTimeout()));
  }

  teamFlashHistory(): Observable<ITeamProductsFlashHistory[]> {
    const route = getServiceUrl('BACKEND_URL') + 'firmwaresused/history';
    return this.http.get<ITeamProductsFlashHistory[]>(route).pipe(timeout(getTimeout()));
  }
}
