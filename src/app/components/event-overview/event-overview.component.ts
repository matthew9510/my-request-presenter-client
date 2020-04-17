import { Component, OnInit } from "@angular/core";
import { EventService } from "src/app/services/event.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { environment } from "@ENV";

@Component({
  selector: "app-event-overview",
  templateUrl: "./event-overview.component.html",
  styleUrls: ["./event-overview.component.scss"],
})
export class EventOverviewComponent implements OnInit {
  eventId: string;
  event: any;
  venue: any;
  performer: any;
  typeOfCoverFee: string;
  baseUrl: string = environment.baseUrl;

  constructor(
    private eventService: EventService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private location: Location
  ) {
    this.eventId = this.actRoute.snapshot.params.id;
  }

  ngOnInit() {
    this.onGetEventById();
  }

  onGetEventById() {
    this.eventService.getEventById(this.eventId).subscribe((res: any) => {
      this.event = res.response.body.Item;
      this.typeOfCoverFee = typeof this.event.coverFee;
      this.eventService.getVenue(this.event.venueId).subscribe((res: any) => {
        this.venue = res.response.body.Item;
      });
      this.eventService
        .getPerformerInfoById(this.event.performerId)
        .subscribe((res: any) => {
          this.performer = res.response.body.Item;
        });
    });
  }

  backClicked() {
    this.location.back();
  }

  editEvent() {
    this.router.navigate([`/event/${this.event.id}/clone`], {
      state: { event: this.event, venue: this.venue },
    });
  }

  navigateToRequests(eventId: string) {
    this.eventService.currentEvent = this.event;
    this.eventService.currentEvent.id = eventId;
    this.router.navigate([`/event/${this.event.id}`]);
  }
}
