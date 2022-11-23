import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { UserModel } from "src/app/models/user";
import { SessionModel } from "src/app/models/session";

@Component({
    selector: 'active-users',
    templateUrl : './active-users.component.html',
    styleUrls : ['./active-users.component.css']
})

export class ActiveUsers {
    activeUserList : UserModel[] = [];
    currentUser! : UserModel
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth){
        this.fireAuth.user.subscribe(currentuser => {
            this.db.list<UserModel>('users').valueChanges().subscribe(users => {
                for(let i = 0; i < users.length ; i++) {
                    if(currentuser?.uid === users[i].uid) {
                        this.currentUser = users[i];
                        break;
                    }
                }
            })
        })
        this.db.list<UserModel>('users').valueChanges().subscribe(users => {
            this.activeUserList = [];
            for(let i = 0; i < users.length; i++) {
                if(users[i].active === true) {
                    this.activeUserList.push(users[i])
                }
            }
        })
    }

    activateSession(endUser : UserModel) : void {

        //Aynı iki user arasında session silinmemişse yeni bir session başlatılamamalı. Bunun kontrolünü sağlayan if statement dikkatlice yazılmalı.
        let newSession = new SessionModel()
        newSession.firstUser = this.currentUser;
        newSession.endUser = endUser;
        newSession.conversation = [];
        this.db.list('sessions').push(newSession).then(response => {
            newSession.sessionID = response.key!;
            this.db.list('sessions').update(newSession.sessionID , newSession).then(() => {
                this.currentUser.sessions.push(newSession.sessionID);
                endUser.sessions.push(newSession.sessionID);
                this.db.list('users').update(this.currentUser.key , this.currentUser).then(() => {
                    this.db.list('users').update(endUser.key , endUser);
                }) 
            })
        })
    }
}