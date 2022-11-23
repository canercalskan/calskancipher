import { Component } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import Swal from "sweetalert2";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UserModel } from "src/app/models/user";
@Component({
    selector : 'chat',
    templateUrl : './chat.component.html',
    styleUrls : ['./chat.component.css']
})

export class ChatComponent {
    userName! : string;
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth) {}
}