import { Injectable } from '@angular/core';
import { Requests } from '../interfaces/requests';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@ENV';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  jwt = "";
  HEADERS = new HttpHeaders({
    Authorization: this.jwt,
  })

  constructor(private _http: HttpClient) { }

  makeRequest(request: any) {
    console.log(request)
    return this._http.post(`${environment.requestsUrl}`, request)
  }

  // getRequestById() {
  //   return this._http.get(`https://y05btwgzvf.execute-api.us-west-2.amazonaws.com/dev/requests?id='8707cb60-560d-11ea-b23e-b109773942df'`);
  // }

  // onGetRequest() {
  //   this.getRequestById().subscribe(
  //     (res) => {
  //       console.log(res);
  //     }, (err) => {
  //       console.log(err);
  //     }
  //   )
  // }

  getAcceptedRequestsByEventId(eventId: string) {
    return this._http.get(`${environment.eventsUrl}/${eventId}/requests/?status=accepted`,
      // { headers: this.HEADERS }
    );
  }

  getNowPlayingRequestsByEventId(eventId: any) {
    return this._http.get(`${environment.eventsUrl}/${eventId}/requests/?status=now%20playing`
      // { headers: this.HEADERS }
    );
  }

}
