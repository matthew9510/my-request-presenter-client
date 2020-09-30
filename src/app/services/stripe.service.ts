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
  isStripePaymentMethodError: boolean = false;
  originalPaymentIntentId: string;

  constructor(private http: HttpClient) {}

  createPaymentIntent(performerStripeId: string, paidRequest: any, token: any) {
    let params = new HttpParams();
    params = params.append("debug", "false");

    const payload = Object.assign({ performerStripeId }, paidRequest);
    payload.token = token;

    return this.http.post(
      `${environment.stripeUrl}/createPaymentIntent?${params.toString()}`,
      payload
    );
  }

  createAndCapturePaymentIntent(
    performerStripeId: string,
    paidRequest: any,
    token: any
  ) {
    let params = new HttpParams();
    params = params.append("debug", "true");

    const payload = Object.assign({ performerStripeId }, paidRequest);
    payload.token = token;

    return this.http.post(
      `${
        environment.stripeUrl
      }/createAndCapturePaymentIntent?${params.toString()}`,
      payload
    );
  }

  updatePaymentIntentWithNewPaymentMethod(
    performerStripeId: string,
    paidRequest: any,
    token: any
  ) {
    let params = new HttpParams();
    params = params.append("debug", "false");

    const payload = Object.assign(
      {
        performerStripeId,
        originalPaymentIntentId: this.originalPaymentIntentId,
      },
      paidRequest
    );
    payload.token = token;

    return this.http.post(
      `${
        environment.stripeUrl
      }/updatePaymentIntentWithNewPaymentMethod?${params.toString()}`,
      payload
    );
  }
}
