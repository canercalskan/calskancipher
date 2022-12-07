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
    currentUser! : UserModel;
    firstUserContains! : boolean;
    endUserContains! : boolean;
    currentUserSessions : SessionModel[] = []
    newMessageCount = 0;
    notifications : UserModel[] = []
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
                if(users[i].active === true && users[i].uid !== this.currentUser.uid) { //
                    this.activeUserList.push(users[i])
                }
            }
        })

        this.db.list<SessionModel>('sessions').valueChanges().subscribe((r) => {
            for(let i = 0; i < r.length; i++) {
                if(this.currentUser.sessions.includes(r[i].sessionID)) {
                    this.currentUserSessions.push(r[i]);
                }
            }
        })
        for(let i = 0; i < this.currentUserSessions.length; i++ ){
            for(let a = 0 ; a < this.currentUserSessions[i].conversation.length; a++) {
                if(this.currentUserSessions[i].conversation[a].sender.uid !== this.currentUser.uid 
                    && !this.currentUserSessions[i].conversation[a].read) {
                        this.notifications.push(this.currentUserSessions[i].conversation[a].sender);
                        ////////////// NOTIFICATIONS /////////////
                }
            }
        }
    }

    // activateSession(endUser : UserModel) : void {
    //     let newSession = new SessionModel()
    //     newSession.firstUser = this.currentUser;
    //     newSession.endUser = endUser;
    //     newSession.conversation = [];
    //    this.db.list<SessionModel>('sessions').valueChanges().subscribe(response => {
    //         if(response.length === 0) {
    //             this.db.list<SessionModel>('sessions').push(newSession).then(response => {
    //                 newSession.sessionID = response.key!;
    //                 this.db.list('sessions').update(newSession.sessionID , newSession).then(() => {
    //                     this.currentUser.sessions.push(newSession.sessionID);
    //                     endUser.sessions.push(newSession.sessionID);
    //                     this.db.list('users').update(this.currentUser.key , this.currentUser).then(() => {
    //                         this.db.list('users').update(endUser.key , endUser);
    //                         this.chatComponent.getSessionData(newSession);
    //                         return;
    //                     }) 
    //                 })
    //             })
    //         }
    //         else
    //          {
    //             this.db.list<SessionModel>('sessions').valueChanges().subscribe(response => {
    //                 let found = false;
    //                 let deleted = false;
    //                 for(let i = 0; i < response.length; i++) {
    //                     if((response[i].firstUser.key === this.currentUser.key && response[i].endUser.key === endUser.key)
    //                     || 
    //                     (response[i].firstUser.key === endUser.key && response[i].endUser.key === this.currentUser.key)) {
    //                         found = true;
    //                         if(this.currentUser.sessions.includes(response[i].sessionID , 0) && endUser.sessions.includes(response[i].sessionID , 0)) {
    //                             this.chatComponent.getSessionData(response[i]);
    //                             break;
    //                         }
    //                         else {
    //                             this.db.list<SessionModel>('sessions').push(newSession).then(response => {
    //                                 newSession.sessionID = response.key!;
    //                                 this.db.list('sessions').update(newSession.sessionID , newSession).then(() => {
    //                                     this.currentUser.sessions.push(newSession.sessionID);
    //                                     endUser.sessions.push(newSession.sessionID);
    //                                     this.db.list('users').update(this.currentUser.key , this.currentUser).then(() => {
    //                                         this.db.list('users').update(endUser.key , endUser);
    //                                         this.chatComponent.getSessionData(newSession);
    //                                         return; 
    //                                     }) 
    //                                 })
    //                             })
    //                         }
    //                     }
    //                 }

    //                 if(!found) {
    //                     this.db.list<SessionModel>('sessions').push(newSession).then(response => {
    //                         newSession.sessionID = response.key!;
    //                         this.db.list('sessions').update(newSession.sessionID , newSession).then(() => {
    //                             this.currentUser.sessions.push(newSession.sessionID);
    //                             endUser.sessions.push(newSession.sessionID);
    //                             this.db.list('users').update(this.currentUser.key , this.currentUser).then(() => {
    //                                 this.db.list('users').update(endUser.key , endUser);
    //                                 this.chatComponent.getSessionData(newSession);
    //                                 return;
    //                             }) 
    //                         })
    //                     })
    //                 }
    //             })
    //         }
    //    })
    // }
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