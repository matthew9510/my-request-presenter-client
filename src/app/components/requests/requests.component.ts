import { Component, OnInit } from "@angular/core";
import { RequestsService } from "src/app/services/requests.service";
import { EventService } from "src/app/services/event.service";
import { PerformerService } from "@services/performer.service";
import { MatDialog } from "@angular/material/dialog";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MakeRequestComponent } from "../make-request/make-request.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { translate } from "@ngneat/transloco";

import { interval, of, from, pipe } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.scss"],
})
export class RequestsComponent implements OnInit {
  eventId: string;
  event: any;
  performer: any;
  noRequestsMessage: boolean = false;
  eventStatus: string;
  acceptedRequests: any;
  nowPlayingRequest: any;
  currentlyPlaying: boolean = false;

  constructor(
    private requestsService: RequestsService,
    private eventService: EventService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar,
    private router: Router,
    private actRoute: ActivatedRoute,
    private location: Location,
    private performerService: PerformerService
  ) {
    this.eventId = this.actRoute.snapshot.params.id;
    // storing the current event id so the user can easily navigate back to the event if they close the tab or refresh the page
    localStorage.setItem("currentEventId", this.eventId);

    // reloads event and request info every 10 sec
    interval(10000).subscribe((x) => {
      this.onGetRequestsByEventId();
      this.onGetEventById();
    });
  }

  ngOnInit() {
    this.onGetRequestsByEventId();
    this.onGetEventById();
  }

  navigateToErrorPage() {
    this.router.navigate(["/error"]);
  }

  // checks the event id in url to check status
  onGetEventById() {
    // if we have a performer already just fetch the event entry from the db
    if (this.performer) {
      this.eventService.getEventById(this.eventId).subscribe(
        (res: any) => {
          if (res.response !== undefined) {
            this.event = res.response.body.Item;
            this.eventStatus = this.event.status;
            this.eventService.currentEvent = this.event;
            this.eventService.currentEventId = this.event.id;
          }
        },
        (err) => console.log(err)
      );
    } else {
      this.eventService
        .getEventById(this.eventId)
        .pipe(
          concatMap((event: any) => {
            return this.performerService
              .getPerformerInfoById(event.response.body.Item.performerId)
              .pipe(
                map((performer) => {
                  return { performer: performer, event: event };
                })
              );
          })
        )
        .subscribe((res: any) => {
          let event = res.event.response.body.Item;
          let performer = res.performer.response.body.Item;

          if (event !== undefined) {
            this.event = event;
            this.eventStatus = this.event.status;
            this.eventService.currentEvent = this.event;
            this.eventService.currentEventId = this.event.id;
            this.performerService.currentEventPerformer = this.performer;
            this.performer = performer;
          }
        });
    }
  }

  onGetRequestsByEventId() {
    this.requestsService
      .getAcceptedRequestsByEventId(this.eventId)
      .subscribe((res: any) => {
        if (res.response.statusCode === 204) {
          this.acceptedRequests = null;
          this.noRequestsMessage = true;
        } else if (res.response.body) {
          this.noRequestsMessage = false;
          // Method to remove duplicates and combine amounts of original requests and top ups
          // Note: res.response.body will have original requests before top-ups due to sorting by createdOn date
          this.acceptedRequests = res.response.body.reduce(
            (acc: any[], curr: any, currIndex: any, array: any) => {
              // if request is an original
              if (curr.id === curr.originalRequestId) {
                curr.topUps = [];
                acc.push(curr);
              } else {
                // if request is a top-up
                const originalRequestIndex = acc
                  .map((request) => request.id)
                  .indexOf(curr.originalRequestId);
                acc[originalRequestIndex].amount += curr.amount;
                acc[originalRequestIndex].topUps.push(curr);
              }
              return acc;
            },
            []
          );
          // console.log(this.acceptedRequests)
        }
      });
    this.requestsService.getNowPlayingRequestsByEventId(this.eventId).subscribe(
      (res: any) => {
        if (res.response.statusCode === 204) {
          this.currentlyPlaying = false;
          this.nowPlayingRequest = {
            song: null,
            artist: null,
            amount: null,
            memo: null,
            status: null,
          };
        } else if (res.response.body.length > 0) {
          this.nowPlayingRequest = res.response.body.reduce(
            (acc: any[], curr: any, currIndex: any, array: any) => {
              // if request is an original
              if (curr.id === curr.originalRequestId) {
                curr.topUps = [];
                acc.push(curr);
              } else {
                // if request is a top-up
                const originalRequestIndex = acc
                  .map((request) => request.id)
                  .indexOf(curr.originalRequestId);
                acc[originalRequestIndex].amount += curr.amount;
                acc[originalRequestIndex].topUps.push(curr);
              }
              return acc;
            },
            []
          )[0];
          this.currentlyPlaying = true;
          // console.log("nowplaying request", this.nowPlayingRequest)
        }
      },
      (err) => console.log(err)
    );
  }

  get isLargeScreen() {
    return this.breakpointObserver.isMatched("(min-width: 700px)");
  }

  openSnackBar(message: string, durationSeconds: number) {
    this._snackBar.open(message, "Dismiss", {
      duration: durationSeconds * 1000,
      verticalPosition: "top",
    });
  }

  openDialog(
    isTopUp: boolean,
    dialogTitle: string,
    status?: string,
    originalRequestId?: string,
    song?: string,
    artist?: string
  ): void {
    const dialogRef = this.dialog.open(MakeRequestComponent, {
      width: "700px",
      data: {
        isTopUp,
        dialogTitle,
        originalRequestId,
        song,
        artist,
        status,
        eventId: this.eventId,
        performerId: this.event.performerId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const message = translate("snackbar request successful");
        this.openSnackBar(message, 7);
      }
    });
  }
}
