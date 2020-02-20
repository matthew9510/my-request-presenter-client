import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SearchEventsComponent } from "./components/search-events/search-events.component";

const routes: Routes = [
  {
    path: "events",
    component: SearchEventsComponent,
    data: { title: "Manage Events" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
