import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { NotFound } from './components/pages/not-found/not-found.component';
import { ChatComponent } from './components/pages/chat/chat.component';
import { AuthGuard } from './services/guards/auth';
const routes: Routes = [
  {path : '' , component : HomeComponent},
  {path : 'Home' , component : HomeComponent},
  {path : 'Login' , component: LoginComponent},
  {path : 'Chat' , component : ChatComponent , canActivate : [AuthGuard] },
  {path : '**' , component : NotFound}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
