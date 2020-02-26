import { Injectable } from '@angular/core';
import { Requests } from '../interfaces/requests';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  requestUrl: string = "requests/";
  pendingRequests: Requests[];
  acceptedRequests: Requests[];

  constructor(private _http: HttpClient) { }

  makeRequest(request) {
    return this._http.put('https://y05btwgzvf.execute-api.us-west-2.amazonaws.com/dev/requests', request)
  }

  fetchPendingRequests() {
    return this._http.get<Requests[]>('../assets/requests/pendingRequests.json');
  }

  fetchAcceptedRequests() {
    return this._http.get<Requests[]>('../assets/requests/acceptedRequests.json')
  }

  onFetchRequests() {
    this.fetchPendingRequests()
      .subscribe((res: Requests[]) => {
        this.pendingRequests = res;
      });
    this.fetchAcceptedRequests()
      .subscribe((res: Requests[]) => this.acceptedRequests = res);
  }

}
