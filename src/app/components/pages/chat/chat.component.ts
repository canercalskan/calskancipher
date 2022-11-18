import { Component } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import Swal from "sweetalert2";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UserModel } from "src/app/models/user";
@Component({
    selector : 'chat',
    templateUrl : './chat.component.html',
    styleUrls : ['./chat.component.css']
})

export class ChatComponent {
    userName! : string
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth) {
        this.fireAuth.user.subscribe(r => {
            this.userName = r!.displayName!;
        })
    }
    handleLogOff() : void {
        this.fireAuth.user.subscribe(currentUser => {
            this.db.list<UserModel>('users').valueChanges().subscribe(response => {
                response.forEach(user => {
                    if(user.uid === currentUser?.uid) {
                        user.active = false;
                        this.db.list('users').update(user.key , user);
                        this.fireAuth.signOut().then(() => {
                            location.reload();
                        }).catch(err => {
                            Swal.fire('Error' , err.code , 'error')
                        })
                    }
                })
            })
        })
    }
}