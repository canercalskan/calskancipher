import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { AngularFireModule } from '@angular/fire/compat';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { NavbarComponent } from './components/layouts/navbar/navbar.component';
import { CipherService } from './services/cipher';
import { FormsModule } from '@angular/forms';
import { NotFound } from './components/pages/not-found/not-found.component';
import { LoginComponent } from './components/pages/login/login.component';
import { ChatComponent } from './components/pages/chat/chat.component';
import { AuthGuard } from './services/guards/auth';
import { LoginsGuard } from './services/guards/login';
import { ChatNavbar } from './components/layouts/chat-navbar/chat-navbar.component';
import { UserService } from './services/user';
import { ActiveUsers } from './components/layouts/active-users/active-users.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    FooterComponent,
    NavbarComponent,
    NotFound ,
    LoginComponent ,
    ChatComponent, ChatNavbar,
    ActiveUsers
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    NgbModule,  
    CipherService ,
    AuthGuard ,
    LoginsGuard ,
    UserService
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
