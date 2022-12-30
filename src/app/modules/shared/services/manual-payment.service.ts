import { getServiceUrl } from '@shared/appSettings';
import { IJsonSuccessResponse } from '@shared/models/ijson.success.response.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManualPaymentService {
  constructor(private http: HttpClient) {}

  manualOrder(plan: string): Observable<IJsonSuccessResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'users/order/' + plan;
    return this.http.get<IJsonSuccessResponse>(route);
  }
}
