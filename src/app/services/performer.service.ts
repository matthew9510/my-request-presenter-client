import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PerformerService {
  currentEventPerformer: any;
  isPerformerSignedUpWithStripe: boolean;
  constructor(private http: HttpClient) {}

  getPerformerInfoById(performerId: string) {
    return this.http.get(
      `${environment.performersUrl}/${performerId}`,
      this.createHeaders(performerId)
    );
  }

  createHeaders(performerId) {
    return {
      headers: new HttpHeaders({
        Authorization: performerId, // this is essentially saying ther performer is accessing the db. This should be the anonyomous user token recieved after swapping the awsidentityId for a temporary token to access the db and lambdas.
      }),
    };
  }
}
