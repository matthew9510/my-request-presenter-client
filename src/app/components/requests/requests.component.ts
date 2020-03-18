import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
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
  noRequestsMessage: boolean = false;
  eventStatus: string = "active";
  acceptedRequests: any;
  nowPlayingRequest: any;
  currentlyPlaying: boolean = false;

  constructor(
    private requestsService: RequestsService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar,
    private actRoute: ActivatedRoute
  ) {
    this.eventId = this.actRoute.snapshot.params.id;
    interval(5000).subscribe(x => {
      this.onGetRequestsByEventId();
    });
  }


  ngOnInit() {
    this.onGetRequestsByEventId();
  }

  onGetRequestsByEventId() {
    this.requestsService.getAcceptedRequestsByEventId(this.eventId)
      .subscribe((res) => {
        if (res['response'] === undefined) {
          this.noRequestsMessage = true;
        } else {
          this.acceptedRequests = res['response']['body'];
        };
      });
    this.requestsService.getNowPlayingRequestsByEventId(this.eventId)
      .subscribe((res) => {
        if (res['response'] !== undefined) {
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
