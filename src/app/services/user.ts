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
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth , private storage : AngularFireStorage) {}
    private basePath = '/uploads/';
    urls: string[] = []
    productUrls: string[] = [];
    chatComp! : ChatComponent

    pushFileToStorage(currentUser : UserModel , fileUpload: FileList): void {
        let filePath = `${this.basePath}/${fileUpload.item(0)?.name}`;
        let storageRef = this.storage.ref(filePath);
        let uploadTask = this.storage.upload(filePath, fileUpload.item(0));
        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            //this.chatComp.showUploadingIcon();
            storageRef.getDownloadURL().subscribe(downloadURL => {
                this.saveFileData(currentUser , downloadURL)
            })
          })
        ).subscribe()
      }
    
    private saveFileData(currentUser : UserModel , downloadURL : string): void {
        currentUser.profilePicture = downloadURL;
        this.db.list(this.basePath).push(currentUser.profilePicture).then(() => {
            this.db.object('users/' + currentUser.key).update(currentUser).then(() => {
                //this.chatComp.hideUploadingIcon();
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