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
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth , private userService : UserService) {}

    getSessionData(session : SessionModel) : void {
        this.displaySession = session;
    }

    sendMessage(message : MessageModel) : void {
        message.sender = this.displaySession.firstUser;
        this.userService.sendMessage(this.displaySession , message);
    }
}