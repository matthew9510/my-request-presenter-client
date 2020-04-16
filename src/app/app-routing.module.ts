import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RequestsComponent } from "./components/requests/requests.component";
import { MakeRequestComponent } from "./components/make-request/make-request.component";
import { SearchEventsComponent } from "./components/search-events/search-events.component";
import { EventOverviewComponent } from "./components/event-overview/event-overview.component";

const routes: Routes = [
  { path: "", redirectTo: "events", pathMatch: "full" },
  {
    path: "event/:id",
    component: RequestsComponent,
    data: { title: "Requests" },
  },
  {
    path: "request/new",
    component: MakeRequestComponent,
    data: { title: "Make a Request" },
  },
  {
    path: "events",
    component: SearchEventsComponent,
    data: { title: "Events" },
  },
  {
    path: "event-overview/:id",
    component: EventOverviewComponent,
    data: { title: "Event Details" },
  },
  { path: "**", redirectTo: "events", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
