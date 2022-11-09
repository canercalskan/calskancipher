import { Component } from "@angular/core";
import { UserModel } from "src/app/models/user";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";

@Component({
    selector : 'login',
    styleUrls : ['./login.component.css'],
    templateUrl: './login.component.html'
})

export class LoginComponent {
    loginError! : boolean;
    registerForm : boolean = false;
    passwordConflict! : boolean;
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth , private router : Router){}

    registerClicked() : void {
        this.registerForm = true;
    }

    handleLoginSubmission(user : UserModel){
        this.fireAuth.signInWithEmailAndPassword(user.email , user.password).catch(() => {
            this.loginError = true;
        })
    }
    handleRegisterSubmission(user : UserModel) : void {
        if(user.password !== user.confirmPassword) {
            this.passwordConflict = true;
            return;
        }
        this.fireAuth.createUserWithEmailAndPassword(user.email , user.password).then(() => {
            Swal.fire('Success' , 'You have successfully registered, enjoy chatting!' , 'success').then(() => {
                this.router.navigate(['Chat'])
            });
        }).catch(err => {
            Swal.fire('Error' , 'Something went horribly wrong..' , 'error');
            console.log(err.code);
        })
    }
    handleGoogleLogin(){
        let googleProvider = new firebase.auth.GoogleAuthProvider();
        this.fireAuth.signInWithPopup(googleProvider).then((r) => {
            Swal.fire('Success' , 'Enjoy chatting !' , 'success').then( () => {
                sessionStorage.setItem('activeUser' , JSON.stringify(r.user));
            }).then(() => {
                this.router.navigate(['Chat']);
            });
        }).catch(() => {
            Swal.fire('Error' , 'Something went horribly wrong...' , 'error');
        })
    }
}