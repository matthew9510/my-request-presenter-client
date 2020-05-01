import { Component, OnInit, Input } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";

@Component({
  selector: "app-request-details",
  templateUrl: "./request-details.component.html",
  styleUrls: ["./request-details.component.scss"],
})
export class RequestDetailsComponent implements OnInit {
  @Input() artist: string;
  @Input() song: string;
  @Input() amount: number;
  @Input() status: string;
  @Input() createdOn: string;
  @Input() amountOfTopUps: number;
  @Input() eventId: string;
  @Input() performerId: string;
  @Input() originalRequestId: string;
  liked: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {}

  get isSmallScreen() {
    return this.breakpointObserver.isMatched("(max-width: 450px)");
  }

  get isLargeScreen() {
    return this.breakpointObserver.isMatched("(min-width: 700px)");
  }
}
