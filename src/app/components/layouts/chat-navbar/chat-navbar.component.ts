import { Component } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UserService } from "src/app/services/user";
import { UserModel } from "src/app/models/user";
@Component({
    selector : 'chat-navbar',
    templateUrl : './chat-navbar.component.html',
    styleUrls : ['./chat-navbar.component.css']
})

export class ChatNavbar {
    user! : UserModel
    constructor(private userService : UserService , private db : AngularFireDatabase , private fireAuth : AngularFireAuth){
       this.fireAuth.user.subscribe(currentUser => {
            this.db.list<UserModel>('users').valueChanges().subscribe(response => {
                for(let i = 0; i < response.length; i++ ){
                    if(response[i].uid === currentUser?.uid) {
                        this.user = response[i];
                    }
                }
            })
        })
    }
    handleLogOff() : void {
        this.userService.handleLogOff()
    }
}
