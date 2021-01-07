import { Component, OnDestroy, OnInit } from "@angular/core";
import { Events, EventService } from "../../services/event.service";
import * as moment from "moment";
import Amplify from "aws-amplify";
import { environment } from "@ENV";

@Component({
  selector: "app-search-events",
  templateUrl: "./search-events.component.html",
  styleUrls: ["./search-events.component.scss"],
})
export class SearchEventsComponent implements OnInit, OnDestroy {
  events: any;
  searchText: string;
  eventsListTitle: string;
  eventsPubSub: any;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.filterEvents(this.eventService.lastSearchStatus);

    // Subscribe to event db table changes
    this.eventsPubSub = Amplify.PubSub.subscribe(
      environment.eventsPubSubTopicName
    ).subscribe({
      next: (data) => {
        // Go update events if there has been any update in the events table
        this.filterEvents(this.eventService.lastSearchStatus);
      },
      error: (error) => console.error(error),
      close: () => console.log("myRequests-events done listening for changes"),
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to event db table changes
    this.eventsPubSub.unsubscribe();
  }

  filterEvents(status: string) {
    this.eventService.lastSearchStatus = status;
    switch (this.eventService.lastSearchStatus) {
      case "all":
        this.eventsListTitle = "All Events";
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
    let now = moment().format();
    this.events = null;

    // display active events
    // displays events with status === 'active' or 'paused' and with a date in the future
    if (status === "active") {
      this.eventService.getAllEvents().subscribe((res: any) => {
        this.events = res.response.body.Items.filter(
          (el: {
            status: string;
            date: string;
            startTime: string;
            endTime: string;
            title: string;
          }) => {
            // Parse the event times
            let startTimeHour = Number(el.startTime.split(":")[0]);
            const isStartTimeAm = el.startTime.includes("AM");
            let endTimeHour = Number(el.endTime.split(":")[0]);
            const isEndTimeAm = el.endTime.includes("AM");

            // handling of ;'12 AM'
            if (isStartTimeAm && startTimeHour === 12) {
              startTimeHour = 0;
            }

            // Add 12 for pm times except if the hour is 12 pm
            if (!isStartTimeAm && startTimeHour !== 12) {
              startTimeHour += 12;
            }
            if (!isEndTimeAm && endTimeHour !== 12) {
              endTimeHour += 12;
            }

            const lengthOfEvent = endTimeHour - startTimeHour;

            return (
              (el.status === "active" || el.status === "paused") &&
              moment(el.date).add(lengthOfEvent, "hours").isSameOrAfter(now)
            );
          }
        );
      });
      // display upcoming events
      // displays events with status === 'created' with a date in the future
    } else if (status === "created") {
      this.eventService.getAllEvents().subscribe((res: any) => {
        this.events = res.response.body.Items.filter(
          (el: { status: string; date: string }) =>
            el.status === status && moment(el.date).isSameOrAfter(now)
        );
      });
      // display past events
      // displays events with status === 'completed' or with a date in the future
    } else if (status === "completed") {
      this.eventService.getAllEvents().subscribe((res: any) => {
        this.events = res.response.body.Items.filter(
          (el: { status: string; date: string }) =>
            (el.status === status || moment(el.date).isBefore(now)) &&
            el.status !== "cancelled"
        );
      });
      // display cancelled events
      // displays events with status === 'cancelled'
    } else {
      this.eventService.getAllEvents().subscribe((res: any) => {
        this.events = res.response.body.Items.filter(
          (el: { status: string }) => el.status === status
        );
      });
    }
  }

  onGetAllEvents() {
    this.events = null;
    this.eventsListTitle = "All Events";
    this.eventService.getAllEvents().subscribe((res: any) => {
      this.eventService.lastSearchStatus = "all";
      this.events = res.response.body.Items;
    }),
      (err: any) => console.log(err);
  }
}
