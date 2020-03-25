import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
import { EventService } from 'src/app/services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MakeRequestComponent } from '../make-request/make-request.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { translate } from '@ngneat/transloco';
import { ActivatedRoute } from '@angular/router';
import { interval, of, from } from 'rxjs';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  eventId: string;
  event: any;
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
    private actRoute: ActivatedRoute
  ) {
    this.eventId = this.actRoute.snapshot.params.id;
    // reloads event and request info every 20 sec
    interval(20000).subscribe(x => {
      this.onGetRequestsByEventId();
      this.onGetEventById()
    });

  }


  ngOnInit() {
    this.onGetRequestsByEventId();
    this.onGetEventById();
  }

  // checks the event id in url to check status
  onGetEventById() {
    this.eventService.getEventById(this.eventId)
      .subscribe(
        (res) => {
          if (res['response'] !== undefined) {
            this.event = res['response']['body']['Item']
            this.eventStatus = this.event['status'];
            this.eventService.currentEvent = this.event;
          }
        },
        (err) => console.log(err)
      );
  }


  onGetRequestsByEventId() {
    this.requestsService.getAcceptedRequestsByEventId(this.eventId)
      .subscribe((res) => {
        if (res['response']['body'].length === 0) {
          this.acceptedRequests = null;
          this.noRequestsMessage = true;
        } else if (res['response']['body']) {
          this.noRequestsMessage = false;
          this.acceptedRequests = res['response']['body'];
        };
      });
    this.requestsService.getNowPlayingRequestsByEventId(this.eventId)
      .subscribe((res) => {
        if (res['response']['body'].length === 0) {
          this.currentlyPlaying = false;
          this.nowPlayingRequest = {
            song: null,
            artist: null,
            amount: null,
            memo: null,
            status: null
          };
        } else if (res['response']['body'].length > 0) {
          this.nowPlayingRequest = res['response']['body'][0];
          this.currentlyPlaying = true;
        }
      }, (err) => console.log(err));
  }

  get isLargeScreen() {
    return this.breakpointObserver.isMatched('(min-width: 700px)');
  }

  openSnackBar(message: string, durationSeconds: number) {
    this._snackBar.open(message, 'Dismiss', {
      duration: durationSeconds * 1000,
      verticalPosition: 'top'
    });
  };

  openDialog(dialogTitle: string, originalRequestId?: string, song?: string, artist?: string): void {
    const dialogRef = this.dialog.open(MakeRequestComponent, {
      width: '700px',
      data: {
        dialogTitle,
        originalRequestId,
        song,
        artist,
        eventId: this.eventId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const message = translate('snackbar request successful');
        this.openSnackBar(message, 7);
      };
    });
  }

}
