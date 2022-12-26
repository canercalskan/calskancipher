import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { UserModel } from "src/app/models/user";
import { SessionModel } from "src/app/models/session";
import { ChatComponent } from "../../pages/chat/chat.component";
import { CipherService } from "src/app/services/cipher";
import Swal from "sweetalert2";

@Component({
    selector: 'active-users',
    templateUrl : './active-users.component.html',
    styleUrls : ['./active-users.component.css']
})

export class ActiveUsers implements OnInit{
    activeUserList : UserModel[] = [];
    currentUser! : UserModel;
    firstUserContains! : boolean;
    endUserContains! : boolean;
    sessionInitialized : boolean = false
    newMessageCount = 0;
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth , private chatComponent : ChatComponent , private cipherService : CipherService){
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
            for (let i = 0; i < users.length; i++) {
                if (users[i].active === true && users[i].uid !== this.currentUser.uid) { //
                    this.activeUserList.push(users[i]);
                }
            }
        })
    }

    ngOnInit(): void {
        this.db.list<SessionModel>('sessions').valueChanges().subscribe(sessionlist => {
            for(let i = 0; i < sessionlist.length; i++) {
                if(sessionlist[i].conversation) {
                    for(let j = 0; j < sessionlist[i].conversation.length; j++) {
                        if(sessionlist[i].conversation[j].sender.uid !== this.currentUser.uid && !sessionlist[i].conversation[j].read) {
                            this.activeUserList.forEach(user => {
                                if(user.uid === sessionlist[i].conversation[j].sender.uid) {
                                    user.showNotification = true;
                                    this.playNewMessageNotificationSound()
                                }
                            })
                        }
                        
                    }
                }
            }
        })
    }

    playNewMessageNotificationSound() : void {
        // let audio = new Audio();
        // audio.src = "../../../assets/notification.mp3"
        // // audio.load();
        // audio.play();
    }

    activateSession(endUser : UserModel) : void {
        let newSession = new SessionModel()
        newSession.firstUser = this.currentUser;
        newSession.endUser = endUser;
        newSession.conversation = [];
        newSession.conversation_key = this.cipherService.generateRandomKey();
        Swal.fire({
            imageUrl : '../../../assets/loading_gif.gif',
            showConfirmButton : false,
            timer : 500,
        });

        this.db.list<SessionModel>('sessions').valueChanges().subscribe(response => {
            if(response.length === 0) {
                this.db.list<SessionModel>('sessions').push(newSession).then(response => {
                    newSession.sessionID = response.key!;
                    this.db.list('sessions').update(newSession.sessionID , newSession).then(() => {
                        this.currentUser.sessions.push(newSession.sessionID);
                        endUser.sessions.push(newSession.sessionID);
                        this.db.list('users').update(this.currentUser.key , this.currentUser).then(() => {
                            this.db.list('users').update(endUser.key , endUser);
                            this.sessionInitialized = true;
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
                            this.sessionInitialized = true
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
                                    this.sessionInitialized = true;
                                    this.chatComponent.getSessionData(newSession);
                                    return;
                                })
                            })
                        })
                    }
                })
            }
        })        
    }

}