import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@ENV';

export interface Events {
  venue: string;
  date: string;
  title: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEvents() {
    return this.http.get<Events[]>('../assets/events.json');
  }

  getAllEvents() {
    const headers = {
      headers: new HttpHeaders({
        "x-api-key": localStorage.getItem('sessionToken'),
      })
    };
    return this.http.get(`${environment.eventsUrl}`, headers)
  }

}
