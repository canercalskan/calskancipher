import { NgModule } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { UserModel } from "../models/user";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { SessionModel } from "../models/session";
import Swal from "sweetalert2";
import { MessageModel } from "../models/message";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from "rxjs";
import { ChatComponent } from "../components/pages/chat/chat.component";

@NgModule()
export class UserService {
    userFound! : boolean;
    user! : UserModel;
    templateSession! : SessionModel;
    selectedFile! : FileList
    currentUser! : UserModel;
    currentUserSessions! : SessionModel[];
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth , private storage : AngularFireStorage) {
        // this.fireAuth.user.subscribe(r => {
        //     this.db.list<UserModel>('users').valueChanges().subscribe(u => {
        //         for(let i = 0; i < u.length; i++) {
        //             if(u[i].uid === r?.uid) {
        //                 this.currentUser = u[i];
        //                 break;
        //             }
        //         }
        //     })
        // })
        // for(let i = 0; i < this.currentUser.sessions.length; i++) {
            
        // }
    }
    private basePath = '/uploads/';
    urls: string[] = []
    productUrls: string[] = [];
    pushFileToStorage(currentUser : UserModel , fileUpload: FileList , session : SessionModel): void {
        let filePath = `${this.basePath}/${fileUpload.item(0)?.name}`;
        let storageRef = this.storage.ref(filePath);
        let uploadTask = this.storage.upload(filePath, fileUpload.item(0));
        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe(downloadURL => {
                this.saveFileData(currentUser , downloadURL)
            })
          })
        ).subscribe()
      }
    
    private saveFileData(currentUser : UserModel , downloadURL : string): void {
        currentUser.profilePicture = downloadURL;
            this.db.object('users/' + currentUser.key).update(currentUser).then(() => {
              for(let i = 0; i < currentUser.sessions.length; i++) {
                this.db.list<SessionModel>('sessions').valueChanges().subscribe(r => {
                    r.forEach(session => {
                        if(session.firstUser.uid === currentUser.uid) {
                            this.db.object<SessionModel>('sessions/' + session.sessionID).update({firstUser : currentUser});
                        }
                        else if(session.endUser.uid === currentUser.uid) {
                            this.db.object<SessionModel>('sessions/' + session.sessionID).update({endUser : currentUser});
                        }
                    })
                })
              }
                })
                    Swal.fire({
                        title : 'Success',
                        text : 'Profile picture updated',
                        showConfirmButton : true,
                        confirmButtonColor : 'green',
                        confirmButtonText : 'Cool!',
                        icon : 'success'
                    }).then(() => {
                        location.reload()
                    })

    }

    deleteProfilePicture(currentUser : UserModel) : void {
        this.storage.refFromURL(currentUser.profilePicture).delete().subscribe(() => {
            currentUser.profilePicture = ' ';
            this.db.object('users/' + currentUser.key).update(currentUser).then(() => {
                    for(let i = 0; i < currentUser.sessions.length; i++) {
                        this.db.list<SessionModel>('sessions').valueChanges().subscribe(r => {
                            r.forEach(session => {
                                if(session.firstUser.uid === currentUser.uid) {
                                    this.db.object<SessionModel>('sessions/' + session.sessionID).update({firstUser : currentUser});
                                }
                                else if(session.endUser.uid === currentUser.uid) {
                                    this.db.object<SessionModel>('sessions/' + session.sessionID).update({endUser : currentUser});
                                }
                            })
                        })
                      }
                Swal.fire('Done.' , 'Your profile image has removed' , 'info');
            })
        })
    }

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

    putSessionData(session : SessionModel) : void {
        this.templateSession = session;
    }

    getSessionData() : SessionModel {
        return this.templateSession;
    }

    sendMessage(session : SessionModel , message : MessageModel) : void {
        let date = new Date();
        let time! : string;
        if(date.getHours() <= 10 && date.getMinutes() <= 10) {
            time = '0' + date.getHours() + ':0' + date.getMinutes()
        }
        else if(date.getHours() <= 10 && date.getMinutes() >= 10) {
            time = '0' + date.getHours() + ':' + date.getMinutes()
        }
        else if(date.getHours() >= 10 && date.getMinutes() <= 10) {
            time = date.getHours() + ':0' + date.getMinutes();
        }
        else {
            time = date.getHours() + ':' + date.getMinutes();
        }

        message.time = time!;
        session.conversation.push(message);
        this.db.list<SessionModel>('sessions').update(session.sessionID , session);
    }


}