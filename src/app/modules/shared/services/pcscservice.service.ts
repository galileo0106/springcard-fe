import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getScriptorTimeout, getServiceUrl } from '@shared/appSettings';
import { IPcScErrorResponse } from '@shared/models/Pcsc/ipcscerrorresponse.model';
import { IPcScPcScServiceMiddlewareStatus } from '@shared/models/Pcsc/IPcScPcScServiceMiddlewareStatus.model';
import { IPcScReadersList } from '@shared/models/Pcsc/ipcscreaderslist.model';
import { IPcScScardConnect } from '@shared/models/Pcsc/ipcscscardconnect.model';
import { IPcScScardDisconnectResponse } from '@shared/models/Pcsc/ipcscscarddisconnectresponse.model';
import { IPcScScardTransmitResponse } from '@shared/models/Pcsc/ipcscscardtransmitresponse.model';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
export class PcScService {
  constructor(private http: HttpClient) {}

  /**
   * Retourne le status du service PC/SC
   * Voir https://docs.springcard.com/books/Companion/REST_API/PCSC/Routes/PCSC_Status
   */
  public getPCSCServiceStatus(): Observable<IPcScPcScServiceMiddlewareStatus> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'pcsc/status';
    return this.http.get<IPcScPcScServiceMiddlewareStatus>(route).pipe(timeout(getScriptorTimeout()));
  }

  /**
   * Retourne la liste des lecteurs PC/SC
   * Voir https://docs.springcard.com/books/Companion/REST_API/PCSC/Routes/PCSC_Readers
   */
  public getReadersList(): Observable<IPcScReadersList[]> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'pcsc/readers';
    return this.http.get<IPcScReadersList[]>(route).pipe(timeout(getScriptorTimeout()));
  }

  /**
   * Retourne les données d'un lecteur
   * Voir : https://docs.springcard.com/books/Companion/REST_API/PCSC/Routes/PCSC_Reader
   */
  public getReaderData(readerId: string, token?: string): Observable<IPcScReadersList | IPcScErrorResponse> {
    let httpParams = new HttpParams();
    if (token) {
      httpParams = httpParams.append('Token', token);
    }
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'pcsc/reader/' + readerId;
    return this.http.get<IPcScReadersList>(route, { params: httpParams }).pipe(timeout(getScriptorTimeout()));
  }

  /**
   * Connexion à une carte dans un slot
   * Voir : https://docs.springcard.com/books/Companion/REST_API/PCSC/Routes/PCSC_Connect
   */
  public scardConnect(readerId: string): Observable<IPcScScardConnect | IPcScErrorResponse> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'pcsc/reader/' + readerId + '/connect';
    return this.http.post<IPcScScardConnect | IPcScErrorResponse>(route, {}).pipe(timeout(getScriptorTimeout()));
  }

  /**
   * Déconnexion d'une cate
   * Voir : https://docs.springcard.com/books/Companion/REST_API/PCSC/Routes/PCSC_Disconnect
   */
  public scardDisconnect(readerId: string, token: string): Observable<IPcScScardDisconnectResponse | IPcScErrorResponse> {
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'pcsc/reader/' + readerId + '/disconnect';
    return this.http.post<IPcScScardDisconnectResponse | IPcScErrorResponse>(route, { Token: token }).pipe(timeout(getScriptorTimeout()));
  }

  /**
   * Echange d'APDU avec la cate
   * Voir : https://docs.springcard.com/books/Companion/REST_API/PCSC/Routes/PCSC_Transmit
   */
  public scardTransmit(readerId: string, token: string, CAPDU: string): Observable<IPcScScardTransmitResponse | IPcScErrorResponse> {
    const params = {
      Token: token,
      Command: CAPDU,
    };
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'pcsc/reader/' + readerId + '/transmit';
    return this.http.post<IPcScScardTransmitResponse | IPcScErrorResponse>(route, params).pipe(timeout(getScriptorTimeout()));
  }

  /**
   * SCardControl
   * Voir : https://docs.springcard.com/books/Companion/REST_API/PCSC/Routes/PCSC_Control
   */
  public scardControl(readerId: string, token: string, CAPDU: string): Observable<IPcScScardTransmitResponse | IPcScErrorResponse> {
    const params = {
      Token: token,
      Command: CAPDU,
    };
    const route = getServiceUrl('ROOT_SERVICE_URL') + 'pcsc/reader/' + readerId + '/control';
    return this.http.post<IPcScScardTransmitResponse | IPcScErrorResponse>(route, params).pipe(timeout(getScriptorTimeout()));
  }

  public sendApdu(
    mode: string,
    readerId: string,
    token: string,
    CAPDU: string,
  ): Observable<IPcScScardTransmitResponse | IPcScErrorResponse> {
    if (mode === 'transmit') {
      return this.scardTransmit(readerId, token, CAPDU);
    } else {
      return this.scardControl(readerId, token, CAPDU);
    }
  }

  public isSuccessResponse(response: object): boolean {
    return response.hasOwnProperty('Error') ? false : true;
    //return (response.hasOwnProperty('Result') && response['Result'].trim().toLowerCase() === 'error') ? false : true;
  }

  public getErrorsFromResponse(initialMessage: string, response: object): string {
    let errorMessage = initialMessage;
    if (response.hasOwnProperty('Error')) {
      // @ts-ignore
      errorMessage += ' ' + response['Error'];
    }
    if (response.hasOwnProperty('Message')) {
      // @ts-ignore
      errorMessage += ' ' + response['Message'];
    }
    return errorMessage;
  }
}
