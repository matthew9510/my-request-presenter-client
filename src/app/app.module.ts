import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManageEventsComponent } from './components/manage-events/manage-events.component';
import {EventDetailsComponent} from './components/event-detail/event-detail.component';
import {FilterPipe} from './pipes/filter.pipe';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule} from '@angular/forms';
import {BottomNavComponent} from './components/bottom-nav/bottom-nav.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ManageEventsComponent,
    EventDetailsComponent,
    FilterPipe,
    BottomNavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    ScrollingModule,
    MatListModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [FilterPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
