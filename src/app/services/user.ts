import { NgModule } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { UserModel } from "../models/user";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import Swal from "sweetalert2";
@NgModule()
export class UserService {
    userFound! : boolean;
    user! : UserModel
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth) {}

    handleLogOff() : void {
        this.fireAuth.user.subscribe(currentUser => {
            this.db.list<UserModel>('users').valueChanges().subscribe(response => {
                response.forEach(user => {
                    if(user.uid === currentUser?.uid) {
                        user.active = false;
                        this.db.list('users').update(user.key , user)
                        this.fireAuth.signOut().then(() => {
                            location.reload()
                        }).catch(err => {
                           Swal.fire('Error' , err.code , 'error')
                        })
                    }
                })
            })
        }) 
    }
}