import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot,CanActivate,RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({providedIn : 'root'})

@NgModule()

export class AuthGuard implements CanActivate {
  constructor(private fireAuth : AngularFireAuth , private router : Router) {}
  signedIn : boolean = true
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    JSON.parse(sessionStorage.getItem('activeUser')!)
    this.fireAuth.currentUser.then(r => {
        if(!r) {
            this.signedIn = false;
            this.router.navigate(['Login']);
        }
        else {
            this.signedIn = true;
        }
    })
    return this.signedIn;
  }
}

@NgModule()
export class LoginGuard {
  constructor(private fireAuth : AngularFireAuth , private router : Router) {}
}

@NgModule()
export class RegisterGuard {}
