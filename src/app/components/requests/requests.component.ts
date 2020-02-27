import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MakeRequestComponent } from '../make-request/make-request.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  // not sure if this will be necessary once we are able to do patch requests
  updatedStatus: string = '';
  eventStatus: string = "active";

  // now playing request is hard coded for now. there will be only one request with the status 'now-playing' at any given time
  nowPlayingRequest = {
    song: 'Piano Man',
    artist: 'Billy Joel',
    amount: 1.00,
    currentlyPlaying: true
  }

  constructor(
    private requestsService: RequestsService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.requestsService.onFetchRequests();
  }

  get isLargeScreen() {
    return this.breakpointObserver.isMatched('(min-width: 700px)');
  }

  // may need to pass in request_id as well to be able to change the status
  openDialog(): void {
    const dialogRef = this.dialog.open(MakeRequestComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.rejectRequest(index, requestType);
        console.log(result)
      };
    });
  }

}
