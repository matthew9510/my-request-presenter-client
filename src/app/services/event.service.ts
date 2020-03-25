import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@ENV';

export interface Events {
  venue: string;
  date: string;
  title: string;
  id: string;
  favorite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  currentEvent: any = null;

  constructor(private http: HttpClient) { }

  getAllEvents() {
    const headers = {
      headers: new HttpHeaders({
        "x-api-key": localStorage.getItem('sessionToken'),
      })
    };
    return this.http.get(`${environment.eventsUrl}`, headers)
  }

  getEventById(eventId: string) {
    return this.http.get(`${environment.eventsUrl}/${eventId}`);
  }

}
