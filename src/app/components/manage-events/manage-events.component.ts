import { Component, OnInit } from '@angular/core';
import {Events, EventService} from '../../services/event.service';


@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.scss']
})
export class ManageEventsComponent implements OnInit {
  events: any;
  pastEvents: any;
  history: boolean;
  scheduled: boolean;
  searchText: string;
  selected: string = 'Scheduled';

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    if (this.selected === 'Scheduled') {
      this.getEvents();
    }
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

}
