import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot,CanActivate,RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@NgModule()

export class AuthGuard implements CanActivate {
  constructor(private fireAuth : AngularFireAuth , private router : Router) {}
  signedIn : boolean = true
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    
    this.fireAuth.user.subscribe(r => {
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
};

