import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { UserModel } from "src/app/models/user";
import { SessionModel } from "src/app/models/session";
import { ChatComponent } from "../../pages/chat/chat.component";
@Component({
    selector: 'active-users',
    templateUrl : './active-users.component.html',
    styleUrls : ['./active-users.component.css']
})

export class ActiveUsers {
    activeUserList : UserModel[] = [];
    currentUser! : UserModel
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth , private chatComponent : ChatComponent){
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

        let newSession = new SessionModel()
        newSession.firstUser = this.currentUser;
        newSession.endUser = endUser;
        newSession.conversation = [];
        this.db.list<SessionModel>('sessions').valueChanges().subscribe(response => {
            if(response.length === 0) {
                this.db.list<SessionModel>('sessions').push(newSession).then(response => {
                    newSession.sessionID = response.key!;
                    this.db.list('sessions').update(newSession.sessionID , newSession).then(() => {
                        this.currentUser.sessions.push(newSession.sessionID);
                        endUser.sessions.push(newSession.sessionID);
                        this.db.list('users').update(this.currentUser.key , this.currentUser).then(() => {
                            this.db.list('users').update(endUser.key , endUser);
                            this.chatComponent.getSessionData(newSession);
                        }) 
                    })
                })
            }
            else {
                this.db.list<SessionModel>('sessions').valueChanges().subscribe(response => {
                    let found = false;
                    for(let i = 0; i < response.length; i++) {
                        if((response[i].firstUser.key === this.currentUser.key && response[i].endUser.key === endUser.key)
                         || 
                         (response[i].firstUser.key === endUser.key && response[i].endUser.key === this.currentUser.key)) {
                            found = true;
                            if(this.currentUser.key === response[i].endUser.key) {
                                let tempUser : UserModel
                                tempUser = response[i].firstUser;
                                response[i].firstUser = response[i].endUser;
                                response[i].endUser = tempUser;
                                this.db.list<SessionModel>('sessions').update(response[i].sessionID , response[i]);
                            }
                            this.chatComponent.getSessionData(response[i]);
                            break;
                        }
                    }
                    if(!found) {
                        this.db.list<SessionModel>('sessions').push(newSession).then(response => {
                            newSession.sessionID = response.key!;
                            this.db.list('sessions').update(newSession.sessionID , newSession).then(() => {
                                this.currentUser.sessions.push(newSession.sessionID);
                                endUser.sessions.push(newSession.sessionID);
                                this.db.list('users').update(this.currentUser.key , this.currentUser).then(() => {
                                    this.db.list('users').update(endUser.key , endUser);
                                    this.chatComponent.getSessionData(newSession);
                                }) 
                            })
                        })
                    }
                })
            }
        })        
    }
}