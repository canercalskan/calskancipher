import { NgModule } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { UserModel } from "../models/user";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { SessionModel } from "../models/session";
import Swal from "sweetalert2";
import { MessageModel } from "../models/message";
@NgModule()
export class UserService {
    userFound! : boolean;
    user! : UserModel;
    templateSession! : SessionModel;
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth) {}

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
        //Mesajı gönderen kullanıcı, mesajı alan kullanıcının bloklular listesindeyse bu fonksiyon direkt return atmalı
        //Problem : Session oluşturulduktan sonra firstUser ve endUser kullanıcıları karışıyor, tekrar düzenlenmeliler.
        session.endUser.blockedUsers.forEach(key => {
            if(key === message.sender.key) {
                Swal.fire('Error' , 'You are blocked by ' + session.endUser.username , 'error')
                return;
            }
        })
        session.conversation.push(message);
        this.db.list<SessionModel>('sessions').update(session.sessionID , session);
    }
}