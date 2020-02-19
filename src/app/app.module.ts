import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestsComponent } from './components/requests/requests.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { MakeRequestComponent } from './components/make-request/make-request.component';

import { RequestsService } from './services/requests.service'


@NgModule({
  declarations: [
    AppComponent,
    RequestsComponent,
    RequestDetailsComponent,
    MakeRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,

  ],
  providers: [RequestsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
