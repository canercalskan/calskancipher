import { TmplAstRecursiveVisitor } from "@angular/compiler";
import { NgModule, OnInit } from "@angular/core";
import { waitForAsync } from "@angular/core/testing";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

    
@NgModule()
export class LoginsGuard {
    returnVal! : boolean;
    private user! : firebase.default.User | null;
    constructor(private fireAuth : AngularFireAuth , private router : Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.fireAuth.user.subscribe((u) => {
            if(u) {
                this.router.navigate(['Chat'])
                this.returnVal = false;
            }
            else {
                this.returnVal = true;
                }
            })
            return this.returnVal;
    }
}
