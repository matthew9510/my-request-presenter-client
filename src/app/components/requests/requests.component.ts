import { Component, OnInit } from "@angular/core";
import { RequestsService } from "src/app/services/requests.service";
import { EventService } from "src/app/services/event.service";
import { PerformerService } from "@services/performer.service";
import { RequesterService } from "@services/requester.service";
import { MatDialog } from "@angular/material/dialog";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MakeRequestComponent } from "../make-request/make-request.component";
import { EndUserLicenseAgreementComponent } from "../end-user-license-agreement/end-user-license-agreement.component";
import { translate } from "@ngneat/transloco";
import { interval, of, from, pipe, Subscription } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { HostListener } from "@angular/core";
import { environment } from "@ENV";
import { ThrowStmt } from "@angular/compiler";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrderPipe } from "ngx-order-pipe";

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
  sortedAcceptedRequests: any;
  acceptedOrder: string = "modifiedOn";
  acceptedReverse: boolean = true;
  nowPlayingRequest: any;
  currentlyPlaying: boolean = false;
  likedRequests: any = {};
  pollingSubscription: Subscription;
  hidden: string;
  visibilityChange: string;

  constructor(
    private requestsService: RequestsService,
    private requesterService: RequesterService,
    private eventService: EventService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private actRoute: ActivatedRoute,
    private location: Location,
    public performerService: PerformerService,
    private _snackBar: MatSnackBar,
    private orderPipe: OrderPipe
  ) {
    this.eventId = this.actRoute.snapshot.params.id;
  }

  ngOnInit() {
    this.getRequester(); // only do this is the requester eula is not signed by checking the local storage
    this.onGetRequestsByEventId();
    this.onGetEventById();

    // checks browser so when browser is hidden/minimized it will stop polling the db for requests and enable polling when app is visible to the user
    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      this.hidden = "hidden";
      this.visibilityChange = "visibilitychange";
    } else if (typeof document["msHidden"] !== "undefined") {
      this.hidden = "msHidden";
      this.visibilityChange = "msvisibilitychange";
    } else if (typeof document["webkitHidden"] !== "undefined") {
      this.hidden = "webkitHidden";
      this.visibilityChange = "webkitvisibilitychange";
    }
    this.checkHiddenDocument();
  }
  // checks for changes in visibility
  @HostListener(`document:visibilitychange`, ["$event"])
  visibilitychange() {
    this.checkHiddenDocument();
  }

  // if document is hidden, polling will stop. when document is visible, polling will start again
  checkHiddenDocument() {
    if (document[this.hidden]) {
      if (this.pollingSubscription) {
        this.pollingSubscription.unsubscribe();
      }
    } else {
      this.onGetRequestsByEventId();
      this.onGetEventById();
      this.pollingSubscription = interval(10000).subscribe((x) => {
        this.onGetRequestsByEventId();
        this.onGetEventById();
      });
    }
  }

  navigateToErrorPage() {
    this.router.navigate(["/error"]);
  }

  getRequester() {
    if (
      localStorage.getItem("requesterSignedEndUserLicenseAgreement") === null ||
      localStorage.getItem("requesterSignedEndUserLicenseAgreement") === "false"
    ) {
      // Attempt to retrieve requester from db
      this.requesterService
        .getRequesterById(
          localStorage.getItem(this.requesterService.cognitoIdentityStorageKey)
        )
        .subscribe(
          (res: any) => {
            // Show end-user license agreement iff the requester has not already signed one
            if (res.statusCode === 204) {
              localStorage.setItem(
                "requesterSignedEndUserLicenseAgreement",
                "false"
              );
              localStorage.setItem("requesterAcknowledgedMerchant", "false");
              this.promptEndUserLicenseAgreement();
            } else {
              if (
                (localStorage.getItem("requesterAcknowledgedMerchant") ===
                  null ||
                  localStorage.getItem("requesterAcknowledgedMerchant") ===
                    "false") &&
                res.response.acknowledgementOfMerchant === undefined
              ) {
                localStorage.setItem("requesterAcknowledgedMerchant", "false");
              } else if (
                (localStorage.getItem("requesterAcknowledgedMerchant") ===
                  null ||
                  localStorage.getItem("requesterAcknowledgedMerchant") ===
                    "false") &&
                res.response.acknowledgementOfMerchant === true
              ) {
                localStorage.setItem("requesterAcknowledgedMerchant", "true");
              }
            }
          },
          (err) => {
            console.error("can't get requester by id", err);
          }
        );
    }
  }

  promptEndUserLicenseAgreement() {
    let dialogRef = this.dialog.open(EndUserLicenseAgreementComponent, {
      width: "400px",
      autoFocus: false,
      data: {
        dialogTitle: "End User License Agreement",
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        // show snack bar saying end user agreement successfully signed
        let message = translate(
          "requests.end-user-license-agreement-success-message"
        );
        let snackBarRef = this._snackBar.open(message, "Dismiss", {
          duration: 3000,
          verticalPosition: "top",
        });

        snackBarRef.afterDismissed().subscribe(() => {
          snackBarRef = null;
        });
      }
      dialogRef = null;
    });
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
          if (res.performer.response !== undefined) {
            let performer = res.performer.response.body.Item;
            this.performerService.currentEventPerformer = this.performer;
            this.performer = performer;

            // Needed to handle if performer is not signed up with stripe
            this.performerService.isPerformerSignedUpWithStripe = !(
              this.performer.stripeId === undefined
            );
          }

          if (event !== undefined) {
            this.event = event;
            this.eventStatus = this.event.status;
            this.eventService.currentEvent = this.event;
            this.eventService.currentEventId = this.event.id;
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
        }
        this.sortedAcceptedRequests = this.orderPipe.transform(
          this.acceptedRequests,
          this.acceptedOrder
        );
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
        }
      },
      (err) => console.log(err)
    );
  }

  get isLargeScreen() {
    return this.breakpointObserver.isMatched("(min-width: 700px)");
  }

  openDialog(
    isTopUp: boolean,
    dialogTitle: string,
    status?: string,
    originalRequestId?: string,
    song?: string,
    artist?: string
  ): void {
    let dialogRef = this.dialog.open(MakeRequestComponent, {
      width: "400px",
      data: {
        isPaidRequestsOnly: this.event.isPaidRequestsOnly,
        isTopUp,
        dialogTitle,
        originalRequestId,
        song,
        artist,
        status,
        eventId: this.eventId,
        performerId: this.event.performerId,
        performerStripeId: this.performer.stripeId,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // update the requests to show topup change immediatly
      if (result.isSuccessfulTopUp) {
        this.onGetRequestsByEventId();
      }

      dialogRef = null;
    });
  }

  addLike(request: any) {
    this.requestsService
      .makeRequest({
        amount: 0,
        requesterId: localStorage.getItem(
          this.requesterService.cognitoIdentityStorageKey
        ),
        originalRequestId: request.originalRequestId,
        eventId: request.eventId,
        performerId: request.performerId,
        song: request.song,
        status: request.status,
        artist: request.artist,
        createdOn: request.createdOn,
      })
      .subscribe(
        (res: any) => {
          this.likedRequests[request.originalRequestId] = "true";
        },
        (err: any) => console.log(err)
      );
  }
}
