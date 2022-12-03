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

@NgModule()
export class UserService {
    userFound! : boolean;
    user! : UserModel;
    templateSession! : SessionModel;
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth , private storage : AngularFireStorage) {}

    private basePath = '/uploads/';
    urls: string[] = []
    productUrls: string[] = [];

    pushFileToStorage(currentUser : UserModel , fileUpload: File): void {
        // let filePath = `${this.basePath}/${fileUpload.name}`;
        // let storageRef = this.storage.ref(filePath);
        // let uploadTask = this.storage.upload(filePath, fileUpload);
        // uploadTask.snapshotChanges().pipe(
        //   finalize(() => {
        //     storageRef.getDownloadURL().subscribe(downloadURL => {
        //         this.saveFileData(currentUser)
        //     })
        //   })
        // ).subscribe()
      }
    
    private saveFileData(currentUser : UserModel): void {
        // this.db.list(this.basePath).push(currentUser.files).then(() => {
        //     this.db.object('users/' + currentUser.key).update(currentUser).then(() => {
        //         Swal.fire('Success' , 'You updated your profile picture' , 'success')
        //     })
        // }).catch(error => {
        //   Swal.fire('' , error.code)
        // });
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