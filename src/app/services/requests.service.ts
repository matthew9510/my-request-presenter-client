import { Injectable } from "@angular/core";
import { Requests } from "../interfaces/requests";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@ENV";

@Injectable({
  providedIn: "root",
})
export class RequestsService {
  cognitoIdentityStorageKey =
    environment.cognitoIdentityIdPrefix + environment.cognitoIdentityId;
  jwt = "";
  HEADERS = new HttpHeaders({
    Authorization: this.jwt,
  });

  constructor(private _http: HttpClient) {}

  makeRequest(request: any) {
    return this._http.post(`${environment.requestsUrl}`, request);
  }

  // gets all accepted requests for an event
  getAcceptedRequestsByEventId(eventId: string) {
    return this._http.get(
      `${environment.eventsUrl}/${eventId}/requests/?status=accepted`
    );
  }

  // gets now playing requests for an event
  getNowPlayingRequestsByEventId(eventId: any) {
    return this._http.get(
      `${environment.eventsUrl}/${eventId}/requests/?status=now%20playing`
    );
  }
}
