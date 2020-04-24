import { Component, OnInit } from "@angular/core";
import { Events, EventService } from "../../services/event.service";

@Component({
  selector: "app-search-events",
  templateUrl: "./search-events.component.html",
  styleUrls: ["./search-events.component.scss"],
})
export class SearchEventsComponent implements OnInit {
  events: any;
  searchText: string;
  eventsListTitle: string;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.filterEvents(this.eventService.lastSearchStatus);
  }

  filterEvents(status: string) {
    this.eventService.lastSearchStatus = status;
    switch (this.eventService.lastSearchStatus) {
      case "all":
        this.eventsListTitle = "All Events";
        console.log("all");
        this.onGetAllEvents();
        break;
      case "created":
        this.eventsListTitle = "Scheduled Events";
        this.getEventsByStatus(this.eventService.lastSearchStatus);
        break;
      case "active":
        this.eventsListTitle = "Active Events";
        this.getEventsByStatus(this.eventService.lastSearchStatus);
        break;
      case "completed":
        this.eventsListTitle = "Past Events";
        this.getEventsByStatus(this.eventService.lastSearchStatus);
        break;
      case "cancelled":
        this.eventsListTitle = "Cancelled Events";
        this.getEventsByStatus(this.eventService.lastSearchStatus);
        break;
    }
  }

  getEventsByStatus(status: string) {
    // search for active events must include paused events as well
    if (status === "active") {
      this.eventService.getAllEvents().subscribe((res: any) => {
        this.events = null;
        this.events = res.response.body.Items.filter(
          (el: { status: string }) =>
            el.status === "active" || el.status === "paused"
        );
      });
    } else {
      this.eventService.getAllEvents().subscribe((res: any) => {
        this.events = null;
        this.events = res.response.body.Items.filter(
          (el: { status: string }) => el.status === status
        );
      });
    }
  }

  onGetAllEvents() {
    this.eventService.getAllEvents().subscribe((res: any) => {
      this.eventService.lastSearchStatus = "all";
      this.events = res.response.body.Items;
    }),
      (err: any) => console.log(err);
  }
}
