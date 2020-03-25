import { Component, OnInit } from '@angular/core';
import { Events, EventService } from '../../services/event.service';


@Component({
  selector: 'app-search-events',
  templateUrl: './search-events.component.html',
  styleUrls: ['./search-events.component.scss']
})
export class SearchEventsComponent implements OnInit {
  events: any;
  history: boolean;
  scheduled: boolean;
  searchText: string;
  eventsListTitle;

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.getEventsByStatus('active');
  }

  getEventsByStatus(status: string) {
    this.eventService.getAllEvents()
      .subscribe((res) => {
        this.events = null;
        this.events = res['response']['body']['Items']
          .filter((el: { status: string; }) => el.status === status);
      })
  }

  onGetAllEvents() {
    this.eventService.getAllEvents()
      .subscribe((res) => {
        this.events = res['response']['body']['Items'];
        this.history = false;
        this.scheduled = true;
      });
  }

}
