import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class RequesterService {
  cognitoIdentityStorageKey =
    environment.cognitoIdentityIdPrefix + environment.cognitoIdentityId;
  requester: any = {
    id: "us-west-2:8d5e31d1-c7ca-407a-84e8-a8a1c52d8ef0",
    createdOn: "2020-08-07",
    modifiedOn: "2020-08-07",
    signedEndUserLicenseAgreement: "true",
    // acknowledgementOfMerchant: true,
  };

  signedEndUserLicenseAgreement: boolean = false;

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
