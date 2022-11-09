import { Component } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import Swal from "sweetalert2";
@Component({
    selector : 'chat',
    templateUrl : './chat.component.html',
    styleUrls : ['./chat.component.css']
})

export class ChatComponent {
    constructor(private db : AngularFireDatabase) {}
}