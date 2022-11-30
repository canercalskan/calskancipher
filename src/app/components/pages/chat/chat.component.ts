import { Component } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import Swal from "sweetalert2";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UserModel } from "src/app/models/user";
import { SessionModel } from "src/app/models/session";
import { UserService } from "src/app/services/user";
import { MessageModel } from "src/app/models/message";

@Component({
    selector : 'chat',
    templateUrl : './chat.component.html',
    styleUrls : ['./chat.component.css']
})

export class ChatComponent {
    displaySession! : SessionModel;
    endUserName! : string;
    currentUser! : UserModel;
    currentUserUid! : string
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth , private userService : UserService) {
        this.fireAuth.user.subscribe(u => {
            this.currentUserUid = u?.uid!
            this.db.list<UserModel>('users').valueChanges().subscribe(r => {
                for(var i = 0 ; i < r.length ; i++ ){
                    if(r[i].uid === u?.uid!) {
                        this.currentUser = r[i];
                        break;
                    }
                }
            })
        })
    }

    getSessionData(session : SessionModel) : void {
        this.displaySession = session;
        // alttaki mevzu olmuyor, sanırım session firstUser ve endUser ların modellemesini tamamen değiştirmek gerekli.
        // veya , message modelinin içindeki sender kişisini kullanarak blocked? check atabiliriz.
        if(this.displaySession.endUser.uid === this.currentUser.uid) {
            this.displaySession.endUser = this.displaySession.firstUser;
            this.displaySession.firstUser = this.currentUser;
            this.db.list<SessionModel>('sessions').update(this.displaySession.sessionID , this.displaySession);
        }


        
        // if(this.displaySession.endUser.username === this.currentUser.username) {
        //     this.endUserName = this.displaySession.firstUser.username;
        // }
        // else {
        //     this.endUserName = this.displaySession.endUser.username;
        // }
    }

    sendMessage(message : MessageModel) : void {
        message.sender = this.currentUser;
        this.userService.sendMessage(this.displaySession , message);
    }

    deleteConversation(session : SessionModel) : void {
        // session.firstUser.sessions = session.firstUser.sessions.filter(s => s !== session.sessionID)
        // session.endUser.sessions = session.endUser.sessions.filter(s => s !== session.sessionID)
        // this.db.list('users').update(session.firstUser.key , session.firstUser).then(() => {
        //     this.db.list('users').update(session.endUser.key , session.endUser)
        // }).then(() => {
        //         Swal.fire('Success' , 'Conversation with ' + session.endUser.username + ' deleted.' , 'success').then(() => {
        //             location.reload();
        //         })
        //     })
        Swal.fire('Success' , 'Conversation deletion is experimental.. May be really implemented in the future...' , 'success');
    }


    blockUser(session : SessionModel) : void {

        if(session.firstUser.key === session.endUser.key) {
            Swal.fire('Error' , 'You cannot block yourself' , 'error').then(() => {
               return;
            })
        }
        else {
            session.firstUser.blockedUsers.push(session.endUser.key);
            this.db.list<UserModel>('users').update(session.firstUser.key , session.firstUser).then(() => {
                Swal.fire('Success!' , 'You have blocked ' + session.endUser.username , 'success').then(() => {
                    location.reload();
                })
            }).catch(err => {
                Swal.fire('Error' , 'Something went wrong while blocking ' + session.endUser.username , 'error').then(() => {
                    location.reload();
                })
            })
        }
       
    }
}