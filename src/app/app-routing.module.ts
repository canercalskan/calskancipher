import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { NotFound } from './components/pages/not-found/not-found.component';

const routes: Routes = [
  {path : '' , component : HomeComponent},
  {path : 'Home' , component : HomeComponent},
  {path : '**' , component : NotFound}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
