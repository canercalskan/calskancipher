import { TmplAstRecursiveVisitor } from "@angular/compiler";
import { NgModule, OnInit } from "@angular/core";
import { waitForAsync } from "@angular/core/testing";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs";
import { UserModel } from "src/app/models/user";
    
@NgModule()
export class LoginsGuard {
    returnVal:boolean=true;
    private user! : firebase.default.User | null;
    constructor(private fireAuth : AngularFireAuth , private router : Router) { 
        // this.fireAuth.user.subscribe(u => {
        //     this.user = u || null;
        //     alert(this.user?.email)
        // })
    }

    delay(time : number) {
        return new Promise(resolve => setTimeout(resolve, time));
      }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            this.fireAuth.user.subscribe((u) => {
                if(u) {
                    this.router.navigate(['Chat'])
                    this.returnVal = false;
                }
                else {
                    // return true;
                    this.returnVal = true;
                }
            })
        // if(this.user) {
        //     return false;
        // }
        // else {
        //     return true;
        // } 
    }
}
