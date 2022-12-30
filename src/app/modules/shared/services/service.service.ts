import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getServiceUrl, getTimeout } from '@shared/appSettings';
import { IPongresponse } from '@shared/models/ipong.response.model';
import { IServiceLastVersion } from '@shared/models/iservice.last.version.interface';
import { IVersionCompareOptions } from '@shared/models/iversioncompareoptions.model';
import { Observable } from 'rxjs';
import { shareReplay, timeout } from 'rxjs/operators';

/**
 * Informations sur le service et sur le système
 */
@Injectable()
export class ServiceService {
  constructor(private http: HttpClient) {}

  getServiceInformation(): Observable<any> {
    return this.http.get<any>(getServiceUrl('ROOT_SERVICE_URL') + 'service');
  }

  getSystemInformation(): Observable<any> {
    return this.http.get<any>(getServiceUrl('ROOT_SERVICE_URL') + 'service/system').pipe(shareReplay());
  }

  ping(): Observable<IPongresponse> {
    return this.http.get<IPongresponse>(getServiceUrl('ROOT_SERVICE_URL') + 'service/ping').pipe(timeout(getTimeout()));
  }

  getServiceVersions(): Observable<any> {
    return this.http.get<any>(getServiceUrl('ROOT_SERVICE_URL') + 'service/versions').pipe(timeout(getTimeout()));
  }

  getServiceSettings(): Observable<any> {
    return this.http.get<any>(getServiceUrl('ROOT_SERVICE_URL') + 'service/settings').pipe(timeout(getTimeout()));
  }

  // Recherche, en ligne, la dernière version du service
  getLastVersionNumber(): Observable<IServiceLastVersion> {
    const route = 'https://files.springcard.com/versions/companion-service.json';
    return this.http.get<IServiceLastVersion>(route).pipe(timeout(getTimeout()));
  }

  private versionCompare(v1: string, v2: string, options: IVersionCompareOptions) {
    const lexicographical = options && options.lexicographical;
    const zeroExtend = options && options.zeroExtend;
    let v1parts: Array<string> | Array<number> = v1.split('.');
    let v2parts: Array<string> | Array<number> = v2.split('.');

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) {
        v1parts.push('0');
      }
      while (v2parts.length < v1parts.length) {
        v2parts.push('0');
      }
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
    }

    for (let i = 0; i < v1parts.length; ++i) {
      if (v2parts.length === i) {
        return 1;
      }

      if (v1parts[i] === v2parts[i]) {
        continue;
      } else if (v1parts[i] > v2parts[i]) {
        return 1;
      } else {
        return -1;
      }
    }

    if (v1parts.length !== v2parts.length) {
      return -1;
    }
    return 0;
  }

  isServiceVersionOlderThanProductionVersion(localVersion: string, lastVersion: string): boolean {
    const options: IVersionCompareOptions = {
      lexicographical: false,
      zeroExtend: true,
    };

    // 0 = égal, -1 = celui de droite est plus grand, 1 = celui de gauche est plus grand
    const valret = this.versionCompare(lastVersion, localVersion, options);
    return valret === 1 ? true : false;
  }
}
