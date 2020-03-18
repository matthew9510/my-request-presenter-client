import { Component, OnInit } from '@angular/core';
import { Events, EventService } from '../../services/event.service';


@Component({
  selector: 'app-manage-events',
  templateUrl: './search-events.component.html',
  styleUrls: ['./search-events.component.scss']
})
export class SearchEventsComponent implements OnInit {
  events: any;
  pastEvents: any;
  history: boolean;
  scheduled: boolean;
  searchText: string;
  selected: string = 'Scheduled';

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.onGetAllEvents();
    // if (this.selected === 'Scheduled') {
    //   this.getEvents();
    // }
  }

  getEvents() {
    this.eventService.getEvents()
      .subscribe((res: Events[]) => {
        this.events = res;
        this.history = false;
        this.scheduled = true;
      });
  }
  getPastEvents() {
    this.eventService.getEvents()
      .subscribe((res: Events[]) => {
        this.pastEvents = res;
        this.history = true;
        this.scheduled = false;
      });
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
