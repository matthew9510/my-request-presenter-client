import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestsComponent } from './components/requests/requests.component';
import { MakeRequestComponent } from './components/make-request/make-request.component';
import { SearchEventsComponent } from './components/search-events/search-events.component';


const routes: Routes = [
  { path: '', redirectTo: 'requests', pathMatch: 'full' },
  { path: 'requests', component: RequestsComponent },
  { path: 'make-request', component: MakeRequestComponent },
  { path: 'events', component: SearchEventsComponent, data: { title: 'Manage Events' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
