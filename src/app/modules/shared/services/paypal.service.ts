import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaypalPaymentInformation } from '@shared/models/ipaypalpaymentinformation.model';
import { IJsonResponse } from '@shared/models/jsonresponse.model';
import { getServiceUrl } from '@shared/appSettings';
import { IJsonSuccessResponse } from '@shared/models/ijson.success.response.model';

@Injectable({
  providedIn: 'root',
})
export class PaypalService {
  constructor(private http: HttpClient) {}

  public getPaypalOrderUrl(plan: string): Observable<IPaypalPaymentInformation | IJsonResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'paypal/order/' + plan;
    return this.http.get<IPaypalPaymentInformation | IJsonResponse>(route);
  }

  // Demande l'annulation de demande de paiement auprès du back office
  public cancelPaymentRequest(token: string): Observable<IJsonSuccessResponse> {
    const route = getServiceUrl('BACKEND_URL') + 'paypal/cancel';
    return this.http.post<IJsonSuccessResponse>(route, { token: token });
  }

  // Demande la capture d'un paiement
  public askForOrderCapture(token: string, PayerID: string) {
    const route = getServiceUrl('BACKEND_URL') + 'paypal/return';
    return this.http.post<IJsonSuccessResponse>(route, { token: token, PayerID: PayerID });
  }
}
