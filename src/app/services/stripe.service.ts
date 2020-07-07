import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class StripeService {
  constructor(private http: HttpClient) {}

  createPaymentIntent(performer: any) {
    // Prepare stripe redirect link
    let params = new HttpParams();
    params = params.append("debug", "true");

    return this.http.post(
      `${environment.stripeUrl}/createPaymentIntent?${params.toString()}`,
      performer
    );
  }
}
