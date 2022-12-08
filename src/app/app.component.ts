import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserModel } from './models/user';
import { SessionModel } from './models/session';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calskancipher';
  count = 0
  constructor(private db : AngularFireDatabase , private auth : AngularFireAuth) {}
  //   this.auth.user.subscribe(user => {
  //     this.db.list<SessionModel>('sessions').valueChanges().subscribe(r => {
  //       for(let i = 0 ; i <= r.length; i++ ){
  //         for(let a = 0; a < r[i].conversation.length; a++) {
  //           if(r[i].conversation[a].sender.uid !== user!.uid && !r[i].conversation[a].read) {
  //             this.count++;
  //           }
  //         }
  //       }
  //     })
  //   })
  // }
}
