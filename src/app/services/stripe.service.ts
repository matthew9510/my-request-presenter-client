import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StripeService {
  constructor(private http: HttpClient) {}

  createPaymentIntent(performer: any) {
    let params = new HttpParams();
    params = params.append("debug", "true");

    return this.http.post(
      `${environment.stripeUrl}/createPaymentIntent?${params.toString()}`,
      performer
    );
  }

  processPayment(transactionDetails, accountId: number): Observable<any> {
    // Prepare stripe redirect link
    let params = new HttpParams();
    params = params.append("debug", "true");

    return this.http.post(
      `${
        environment.stripeUrl
      }/processPaymentIntent/${accountId}/?${params.toString()}`,
      transactionDetails
    );
  }
}
