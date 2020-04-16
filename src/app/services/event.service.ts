import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@ENV";

export interface Events {
  venue: string;
  date: string;
  title: string;
  id: string;
  favorite: boolean;
}

@Injectable({
  providedIn: "root",
})
export class EventService {
  currentEvent: any = null;
  currentEventStatus: string = "active";
  headers = {
    headers: new HttpHeaders({
      "x-api-key": localStorage.getItem("sessionToken"),
    }),
  };

  constructor(private http: HttpClient) {}

  // passing in empty object in place of headers since it was causing an error onInit
  getAllEvents() {
    return this.http.get(`${environment.eventsUrl}`, {});
  }

  getEventById(eventId: string) {
    return this.http.get(`${environment.eventsUrl}/${eventId}`, {});
  }

  getVenue(venueId: string) {
    return this.http.get(`${environment.venuesUrl}/${venueId}`);
  }

  getPerformerInfoById(performerId: string) {
    return this.http.get(`${environment.performersUrl}/${performerId}`, {});
  }
}
