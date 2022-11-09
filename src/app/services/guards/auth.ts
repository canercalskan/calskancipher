import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot,CanActivate,RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

// @Injectable({providedIn : 'root'})

@NgModule()

export class AuthGuard implements CanActivate {
  constructor(private fireAuth : AngularFireAuth , private router : Router) {}
  signedIn : boolean = true
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    if(JSON.parse(sessionStorage.getItem('activeUser')!)) {
      return true;
    }
    else {
      this.router.navigate(['Login'])
      return false;
    }
    // this.fireAuth.currentUser.then(r => {
    //     if(!r) {
    //         this.signedIn = false;
    //         this.router.navigate(['Login']);
    //     }
    //     else {
    //         this.signedIn = true;
    //     }
    // })
    //
    // return this.signedIn;
  }
};


// @Injectable({providedIn : 'root'})
// @NgModule()
// export class LoginGuard implements CanActivate {
//   constructor(private fireAuth : AngularFireAuth , private router : Router) {}
//   canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : any {
//     if(!JSON.parse(sessionStorage.getItem('activeUser')!)) {
//       return true;
//     }
//     else {
//       this.router.navigate(['Chat'])
//       return false;
//     }
//   }
// }

// @NgModule()
// export class RegisterGuard {}
