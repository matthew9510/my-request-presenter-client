import { Component, OnInit } from "@angular/core";
import { Events, EventService } from "../../services/event.service";

@Component({
  selector: "app-search-events",
  templateUrl: "./search-events.component.html",
  styleUrls: ["./search-events.component.scss"],
})
export class SearchEventsComponent implements OnInit {
  events: any;
  history: boolean;
  scheduled: boolean;
  searchText: string;
  eventsListTitle: string;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.getEventsByStatus(this.eventService.currentEventStatus);
  }

  getEventsByStatus(status: string) {
    this.eventService.getAllEvents().subscribe((res: any) => {
      // displays which event filter is applied
      switch (status) {
        case "active":
          this.eventsListTitle = "Active Events";
          this.eventService.currentEventStatus = "active";
          break;
        case "created":
          this.eventsListTitle = "Upcoming Events";
          this.eventService.currentEventStatus = "created";
          break;
        case "completed":
          this.eventsListTitle = "Past Events";
          this.eventService.currentEventStatus = "completed";
          break;
        case "all":
          this.onGetAllEvents();
          break;
      }
      if (status === "active") {
        this.events = null;
        this.events = res.response.body.Items.filter(
          (el: { status: string }) =>
            el.status === "active" || el.status === "paused"
        );
      } else {
        this.events = null;
        this.events = res.response.body.Items.filter(
          (el: { status: string }) => el.status === status
        );
      }
    }),
      (err: any) => console.log(err);
  }

  onGetAllEvents() {
    this.eventService.getAllEvents().subscribe((res: any) => {
      this.eventsListTitle = "All Events";
      this.eventService.currentEventStatus = "all";
      this.events = res.response.body.Items;
      this.history = false;
      this.scheduled = true;
    }),
      (err: any) => console.log(err);
  }
}
