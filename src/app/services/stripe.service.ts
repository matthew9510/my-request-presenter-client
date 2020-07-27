import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StripeService {
  minimumRequestAmount: number = 1;
  maximumRequestAmount: number = 100;

  constructor(private http: HttpClient) {}

  createPaymentIntent(performerStripeId: string, paidRequest: any, token: any) {
    let params = new HttpParams();
    params = params.append("debug", "false");

    // for now
    const payload = Object.assign({ performerStripeId }, paidRequest);
    payload.token = token;

    return this.http.post(
      `${environment.stripeUrl}/createPaymentIntent?${params.toString()}`,
      payload
    );
  }
}
