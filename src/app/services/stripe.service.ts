import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StripeService {
  minimumRequestAmount: number = 1;

  constructor(private http: HttpClient) {}

  createPaymentIntent(performerStripeId: string, paidRequest: any) {
    let params = new HttpParams();
    params = params.append("debug", "true");

    // for now
    const payload = Object.assign({ performerStripeId }, paidRequest);

    return this.http.post(
      `${environment.stripeUrl}/createPaymentIntent?${params.toString()}`,
      payload
    );

    // return this.http.post(
    //   `${
    //     environment.stripeUrl
    //   }/createPaymentIntent/${performerStripeId}/?${params.toString()}`,
    //   paidRequest
    // );
  }
}
