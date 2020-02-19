import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  baseUrl: string = environment.BASE_URL;
  requestUrl: string = "requests/";

  constructor(private _http: HttpClient) { }

  makeRequest(request){
    return this._http.post('https://zfp3v9kdn7.execute-api.us-west-2.amazonaws.com/dev/src/', request)
  }
}
