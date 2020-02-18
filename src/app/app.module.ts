import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthenticationComponent } from './components/authentication/authentication.component'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { MakeRequestComponent } from './components/make-request/make-request.component';

import { UserService } from './services/user.service'
import { RequestsService } from './services/requests.service'


@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
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
    AmplifyAngularModule,
  ],
  providers: [AmplifyService, UserService, RequestsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
