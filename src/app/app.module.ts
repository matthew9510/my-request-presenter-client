import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestsComponent } from './components/requests/requests.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MakeRequestComponent } from './components/make-request/make-request.component';
import { RequestsService } from './services/requests.service';
import { TranslocoRootModule } from './transloco-root.module';
import { LayoutModule } from '@angular/cdk/layout';
import { SearchEventsComponent } from './components/search-events/search-events.component';
import { EventDetailsComponent } from './components/event-detail/event-detail.component';
import { FilterPipe } from './pipes/filter.pipe';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatChipsModule,
  MatCardModule,
  MatGridListModule,
  MatTabsModule,
  MatListModule,
  MatDialogModule,
  MatDatepickerModule
} from "@angular/material";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    RequestsComponent,
    RequestDetailsComponent,
    MakeRequestComponent,
    SearchEventsComponent,
    EventDetailsComponent,
    FilterPipe,
    BottomNavComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    TranslocoRootModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatGridListModule,
    MatToolbarModule,
    MatDialogModule,
    LayoutModule,
    MatDatepickerModule,
    ScrollingModule,
    FormsModule
  ],
  providers: [
    RequestsService,
    FilterPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
