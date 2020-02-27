import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventdetails',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: any;
  clone: any;
  eventFavored: string = 'favorite_border';

  @Input()
  set eventData(eventData) {
    if (eventData) {
      eventData.date = moment(eventData.date).format('MMM DD');
      this.event = eventData;
    }
  }

  @Input()
  set cloneEventDate(data) {
    if (data) {
      data.date = moment(data.date).format('MMM DD');
      this.clone = data;
    }
  }

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.event.favorite) {
      this.eventFavored = 'favorite';
    }
  }

  cloneEvent(event) {
    this.clone = event;
  }
  navToEvent() {
    this.router.navigate([`/event/${this.event.id}`]);
  }

}
