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
    endUserImage! : string;
    currentUser! : UserModel;
    currentUserUid! : string
    selectedFile! : FileList;
    showUploading! : boolean;
    noImage! : boolean;
    blocked! : boolean;
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

    showUploadingIcon() : void {
        this.showUploading = true;
    }

    hideUploadingIcon() : void {
        this.showUploading = false;
    }

    getSessionData(session : SessionModel) : void {
        this.displaySession = session;
        if(this.displaySession.endUser.username === this.currentUser.username) {
            this.endUserName = this.displaySession.firstUser.username;
            this.endUserImage = this.displaySession.firstUser.profilePicture;
           for(let i = 0; i < this.displaySession.endUser.blockedUsers.length; i++) {
            if(this.displaySession.endUser.blockedUsers[i] === this.displaySession.firstUser.key) {
                this.blocked = true;
                break;
            }
           }
        }
        else {
            this.endUserName = this.displaySession.endUser.username;
            this.endUserImage = this.displaySession.endUser.profilePicture;
            for(let i = 0 ; i < this.displaySession.firstUser.blockedUsers.length; i++) {
                if(this.displaySession.firstUser.blockedUsers[i] === this.displaySession.endUser.key) {
                    this.blocked = true;
                    break;
                }
            }
        }

        if(!this.displaySession.conversation) {
            this.displaySession.conversation = []
        }

        if(this.displaySession.conversation.length != 0) {
            for(let i = 0 ; i < this.displaySession.conversation.length; i++) {
                if(this.displaySession.conversation[i].sender.uid !== this.currentUser.uid) {
                    this.displaySession.conversation[i].read = true;
                }
            }
        }
            this.db.object<SessionModel>('sessions/' + this.displaySession.sessionID).update(this.displaySession);
    }

    sendMessage(message : MessageModel) : void {
        let blocked = false;
        message.sender = this.currentUser;
        for(let i = 0; i < this.displaySession.endUser.blockedUsers.length; i++) {
            if(message.sender.key === this.displaySession.endUser.blockedUsers[i]) {
                blocked = true;
            }
        }

        for(let i = 0 ; i < this.displaySession.firstUser.blockedUsers.length ; i++) {
            if(message.sender.key === this.displaySession.firstUser.blockedUsers[i]) {
                blocked = true;
            }
        }

        if(!blocked) {
            message.read = false;
            this.userService.sendMessage(this.displaySession , message);
        }
        else {
            Swal.fire({
                icon : 'error',
                title : 'Error',
                text : 'You are blocked by ' + this.endUserName,
                showCancelButton : true,
                showConfirmButton : false,
                cancelButtonAriaLabel : 'Close',
                cancelButtonColor : 'red'

            }).then(() => {
                return;
            })
        }
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
        Swal.fire('Information' , 'Conversation deletion is experimental.. May be really implemented in the future...' , 'success');
    }


    blockUser(session : SessionModel) : void {
        let alreadyBlocked = false;
        if(session.firstUser.key === session.endUser.key) {
            Swal.fire('Error' , 'You cannot block yourself' , 'error').then(() => {
               return;
            })
        }
        else {
            if(session.endUser.key === this.currentUser.key) {
                this.db.object<SessionModel>('sessions/' + session.sessionID).valueChanges().subscribe(r => {
                    for(let i = 0; i < r?.endUser.blockedUsers.length!; i++) {
                        if(session.firstUser.key === r?.endUser.blockedUsers[i]) {
                            Swal.fire({
                                showConfirmButton : false,
                                showCancelButton : true,
                                cancelButtonAriaLabel : 'Close',
                                icon : 'error',
                                title : 'Error',
                                text : 'You have already blocked ' + session.firstUser.username, 
                            })
                            alreadyBlocked = true;
                        }
                    }
                    if(!alreadyBlocked) {
                        this.currentUser.blockedUsers.push(session.firstUser.key)
                        session.endUser.blockedUsers.push(session.firstUser.key)
                        this.db.list<SessionModel>('sessions').update(session.sessionID , session).then(() => {
                            this.db.list<UserModel>('users').update(this.currentUser.key , this.currentUser).then(() => {
                                Swal.fire('Success' , 'You have blocked ' + session.firstUser.username, 'success').then(() => {
                                    this.blocked = true;
                                })
                            })
                        })
                }
                })
            }
            else {
                this.db.object<SessionModel>('sessions/' + session.sessionID).valueChanges().subscribe(r => {
                    for(let i = 0; i < r?.firstUser.blockedUsers.length!; i++) {
                        if(r?.firstUser.blockedUsers[i] === session.endUser.key) {
                            Swal.fire({
                                showConfirmButton : false,
                                showCancelButton : true,
                                cancelButtonAriaLabel : 'Close',
                                icon : 'error',
                                title : 'Error',
                                text : 'You already blocked ' + session.endUser.username, 
                            })
                            alreadyBlocked = true;
                        }
                    }
                    if(!alreadyBlocked) {
                        this.currentUser.blockedUsers.push(session.endUser.key)
                        session.firstUser.blockedUsers.push(session.endUser.key)
                        this.db.list<SessionModel>('sessions').update(session.sessionID , session).then(() => {
                            this.db.list<UserModel>('users').update(this.currentUser.key , this.currentUser).then(() => {
                                Swal.fire('Success' , 'You have blocked ' + session.endUser.username , 'success').then(() => {
                                    this.blocked = true;
                                })
                            })
                        })
                    }
                })
            }
        }
    }

    unblockUser(session : SessionModel) : void {
        if(session.firstUser.uid === this.currentUser.uid) {
           this.currentUser.blockedUsers = this.currentUser.blockedUsers.filter(user => user !== session.endUser.key);
           session.firstUser = this.currentUser;
           this.db.object<UserModel>('users/' + this.currentUser.key).update(this.currentUser).then(() => {
                this.db.object<SessionModel>('sessions/' + session.sessionID).update(session).then(() => {
                    Swal.fire({
                        icon:'success',
                        title : 'Success',
                        text : session.endUser.username + ' unblocked',
                        confirmButtonColor : 'green',
                        confirmButtonText : 'Close'
                    }).then(() => {
                        this.blocked = false;
                    })
                })
           })
        }
        else if(session.endUser.uid === this.currentUser.uid) {
          this.currentUser.blockedUsers = this.currentUser.blockedUsers.filter(user => user !== session.firstUser.key);
          session.endUser = this.currentUser;
          this.db.object<UserModel>('users/' + this.currentUser.key).update(this.currentUser).then(() => {
            this.db.object<SessionModel>('sessions/' + session.sessionID).update(session).then(() => {
                Swal.fire({
                    icon : 'success',
                    title : 'Success' ,
                    text : session.firstUser.username + ' unblocked',
                    confirmButtonColor : 'green',
                    confirmButtonText : 'Close'
                }).then(() => {
                    this.blocked = false
                })
                ;
            })
          })
        }
    }

    handleImageSelection(event : any) : void {
        this.selectedFile = event.target.files;
    }

    uploadImage() : void {
        const file : FileList | null = this.selectedFile;
        this.showUploading = true;
        if(this.selectedFile) {
            this.userService.pushFileToStorage(this.currentUser , file , this.displaySession);
        }
        else {
            Swal.fire('Hata' , 'Bilinmeyen bir hata oluştu.' , 'error');
        }
    }

    deleteProfilePicture() : void {
        this.userService.deleteProfilePicture(this.currentUser)
    }

    handlePermissionChange(subject : string , event : any) : void {
        if(subject = 'anyone') {
            if(event.target.checked) {

            }
            else if(!event.target.checked) {

            }
        }
        if(subject = 'noone') {
            if(event.target.checked) {

            }
            else if(!event.target.checked) {

            }
        }
        if(subject = 'enduser') {
            if(event.target.checked) {

            }
            else if(!event.target.checked) {

            }
        }
    }
}