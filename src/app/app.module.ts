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
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslocoRootModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatGridListModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    LayoutModule,
    HttpClientModule,
    TranslocoRootModule,
    MatDatepickerModule,
  ],
  providers: [RequestsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
