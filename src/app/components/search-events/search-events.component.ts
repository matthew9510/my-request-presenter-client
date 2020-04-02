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
  eventsListTitle: any;

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.getEventsByStatus('active');
  }

  getEventsByStatus(status: string) {
    this.eventService.getAllEvents()
      .subscribe((res: any) => {
        this.events = null;
        this.events = res.response.body.Items
          .filter((el: { status: string; }) => el.status === status);
      }), (err: any) => console.log(err);
  }

  onGetAllEvents() {
    this.eventService.getAllEvents()
      .subscribe((res: any) => {
        this.events = res.response.body.Items
        this.history = false;
        this.scheduled = true;
      }), (err: any) => console.log(err);
  }

}
