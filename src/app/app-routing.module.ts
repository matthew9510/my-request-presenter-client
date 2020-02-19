import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MakeRequestComponent } from './components/make-request/make-request.component';

const routes: Routes = [
  { path: '', redirectTo: 'make-request', pathMatch: 'full' },
  { path: 'make-request', component: MakeRequestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
