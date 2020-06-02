import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter, map, mergeMap } from "rxjs/operators";
import { EventService } from "../../services/event.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public pageTitle: string;
  displayEventTitle: boolean = false;
  eventTitle: string;
  eventId: string;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.subscribeToRouteChangeEvents();
  }

  getEventTitle() {
    this.eventService
      // activeRoute.snapshot["_routerState"]["url"].slice(7) === event id
      // this grabs the current route URL and transforms it into the event id only
      .getEventById(this.activeRoute.snapshot["_routerState"]["url"].slice(7))
      .subscribe((res: any) => {
        this.eventTitle = res.response.body.Item.title;
        this.displayEventTitle = true;
      });
  }

  private setTitleFromRouteData(routeData: any) {
    if (routeData && routeData.title) {
      this.pageTitle = routeData.title;
    } else {
      this.pageTitle = "My Request";
    }
  }

  private getLatestChild(route) {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  private subscribeToRouteChangeEvents() {
    // Set initial title
    const latestRoute = this.getLatestChild(this.activeRoute);
    if (latestRoute) {
      this.setTitleFromRouteData(latestRoute.data.getValue());
    }
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activeRoute),
        map((route) => this.getLatestChild(route)),
        filter((route) => route.outlet === "primary"),
        mergeMap((route) => route.data)
      )
      .subscribe((event: any) => {
        // Sets page title for the app
        if (event.title === "Requests" && this.eventService.currentEvent) {
          this.eventTitle = this.eventService.currentEvent.title;
          this.displayEventTitle = true;
        } else if (event.title === "Requests") {
          this.getEventTitle();
        } else {
          this.setTitleFromRouteData(event);
          this.displayEventTitle = false;
        }
      });
  }
}
