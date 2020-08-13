import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class RequesterService {
  cognitoIdentityStorageKey =
    environment.cognitoIdentityIdPrefix + environment.cognitoIdentityId;
  requester: any;
  constructor(private http: HttpClient) {}

  getRequesterHistory() {
    return this.http.get(
      `${environment.requesterUrl}/${localStorage.getItem(
        this.cognitoIdentityStorageKey
      )}/requests`
    );
  }

  getRequesterById(requesterId) {
    return this.http.get(`${environment.requesterUrl}/${requesterId}`);
  }

  // Called when the requester accepts the EULA
  postRequester(requesterId, requester) {
    return this.http.post(
      `${environment.requesterUrl}/${requesterId}`,
      requester
    );
  }

  // Called when the requester acknowledges the merchant
  patchRequester(requesterId, payload) {
    return this.http.patch(
      `${environment.requesterUrl}/${requesterId}`,
      payload
    );
  }
}
