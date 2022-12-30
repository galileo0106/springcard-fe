import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Service used to read local json file (available in the `/assets` folder)
 */
@Injectable()
export class ExternalFilesService {
  constructor(private http: HttpClient) {}

  readVid(): Observable<any> {
    return this.http.get('./assets/vid.json');
  }
}
