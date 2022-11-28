import { Component } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import Swal from "sweetalert2";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UserModel } from "src/app/models/user";
import { SessionModel } from "src/app/models/session";
import { UserService } from "src/app/services/user";
import { MessageModel } from "src/app/models/message";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
@Component({
    selector : 'chat',
    templateUrl : './chat.component.html',
    styleUrls : ['./chat.component.css']
})

export class ChatComponent {
    displaySession! : SessionModel;
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
        if(session.endUser.uid === this.currentUser.uid) {
            session.endUser.username = session.firstUser.username;
        }
        this.displaySession = session;
    }

    sendMessage(message : MessageModel) : void {
        message.sender = this.currentUser;
        this.userService.sendMessage(this.displaySession , message);
    }

    deleteConversation(session : SessionModel) : void {
        Swal.fire({
            title : 'Success',
            text : 'Conversation deleted',
            showCloseButton : true,
            showConfirmButton : true,
            showDenyButton : true,
            showLoaderOnDeny : true,
        }).then(() => {
            this.db.list<SessionModel>('sessions').remove(session.sessionID).then(() => {
            })
        }
    )}

    // this.db.list<SessionModel>('sessions').remove(session.sessionID);

    blockUser(session : SessionModel) : void {
        if(session.endUser === this.currentUser) {
            session.endUser = session.firstUser;
            session.firstUser = this.currentUser;
        }
        // if(!session.firstUser.blockedUsers) {
        //     session.firstUser.blockedUsers = [];
        // }
        // if(session.endUser.uid === this.currentUser.uid) {
        //     Swal.fire('Error' , 'You cannot block yourself.' , 'error').then(()=> {
        //         return;
        //     })
        // }
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