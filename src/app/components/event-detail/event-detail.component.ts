import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EventService } from "../../services/event.service";
import { FavoriteService } from "../../services/favorite.service";

export interface Favorite {
  ID: string;
  eventID: string;
  userID: string;
}

export interface Favorites {
  favorites: Favorite[];
}

@Component({
  selector: "app-eventdetails",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.scss"],
})
export class EventDetailsComponent implements OnInit {
  event: any = null;
  eventFavored: string = "favorite_border";
  favorite: Favorite = {
    ID: "",
    eventID: "",
    userID: "",
  };
  loading: boolean = true;
  // DON'T DELETE, PLAN FOR BACKEND
  // favorites: Favorite[] = [];

  @Input()
  set eventData(eventData: any) {
    this.event = null;
    this.eventService.getVenue(eventData.venueId).subscribe((res: any) => {
      this.event = eventData;
      this.event.venue = res.response.body.Item;
      this.loading = false;
    });
  }

  @Input()
  set cloneEventDate(data: any) {
    // this.clone = data;
  }

  constructor(
    private router: Router,
    private eventService: EventService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    // DON'T DELETE, PLAN FOR BACKEND
    // if (this.event.favorite) {
    //   this.eventFavored = 'favorite';
    // }
    // this.favoriteService.getFavorites().subscribe( (res: Favorites) => {
    //   // @ts-ignore
    //   this.favorites = res;
    // });
    // for (let a = 0; a < this.favorites.length; a++) {
    //   if (this.favorites[a].eventID === this.event.id) {
    //     this.eventFavored = 'favorite';
    //   }
    // }

    if (sessionStorage.getItem(this.event.id)) {
      this.eventFavored = "favorite";
    } else {
      this.eventFavored = "favorite_border";
    }
  }

  // cloneEvent(event) {
  //   this.clone = event;
  // }

  navToEvent() {
    this.eventService.currentEvent = event;
    this.router.navigate([`/event/${this.event.id}`]);
  }

  navigateToEventOverview() {
    this.router.navigate([`/event-overview/${this.event.id}`]);
  }

  addFavorite() {
    if (!sessionStorage.getItem(this.event.id)) {
      this.favorite.eventID = this.event.id;
      this.favorite.ID = this.event.id;
      this.favorite.userID = sessionStorage.getItem("userID");

      // DON'T DELETE, PLAN FOR BACKEND
      // this.favoriteService.postFavorite(this.favorite).subscribe(
      //   res => {
      //     console.log(res);
      //   }
      // )
      sessionStorage.setItem(this.favorite.ID, this.favorite.eventID);
      this.ngOnInit();
    } else {
      sessionStorage.removeItem(this.event.id);
      this.ngOnInit();
    }
  }
}
