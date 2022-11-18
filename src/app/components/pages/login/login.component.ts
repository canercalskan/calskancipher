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
    password! :string;
    loginError! : boolean;
    registerForm : boolean = false;
    passwordConflict! : boolean;
    constructor(private db : AngularFireDatabase , private fireAuth : AngularFireAuth , private router : Router){}

    registerClicked() : void {
        this.registerForm = true;
    }

    handleLoginSubmission(user : UserModel){
        this.fireAuth.signInWithEmailAndPassword(user.email , user.password).then((activatedUser) => {
            this.db.list<UserModel>('users').valueChanges().subscribe(r => {
                r.forEach(u => {
                    if(u.uid === activatedUser.user?.uid) {
                        u.active = true;
                        this.db.list('users').update(u.key , u);
                    }
                })
            })
        }).catch(() => {
            this.loginError = true;
        })
    }

    backToLogin() : void {
        this.registerForm = false;
    }

    getPassword(event : any) : void {
        this.password = event.target.value;
        let confirmPassword = document.getElementById('confirmPassword');
        let password = document.getElementById('password-register');
        if(this.password === '') {
            confirmPassword!.style.borderBottom = '1px solid #ffff';
            password!.style.borderBottom = '1px solid #ffff';
        }
        else {
            if(event.target.value !== confirmPassword!.textContent) {
                confirmPassword!.style.borderBottom = '1px solid red';
                password!.style.borderBottom = '1px solid red';
            }
            else {
                confirmPassword!.style.borderBottom = '1px solid #167247';
                password!.style.borderBottom = '1px solid #167247';
            }
        }
    }

    checkPasswordConfirm(event : any) : void {
        let password = document.getElementById('password-register');
        let confirmPassword = document.getElementById('confirmPassword');
        if(event.target.value === '') {
            password!.style.borderBottom = '1px solid #ffff';
            confirmPassword!.style.borderBottom = '1px solid #ffff';
        }
        else {
            if(event.target.value !== this.password) {
                password!.style.borderBottom = '1px solid red'
                confirmPassword!.style.borderBottom = '1px solid red'
            }
            else {
                password!.style.borderBottom = '1px solid #167247'
                confirmPassword!.style.borderBottom = '1px solid #167247'
            }
        }

    }

    handleRegisterSubmission(user : UserModel) : void { 
        if(user.confirmPassword !== user.password) {
            this.passwordConflict = true;
            return;
        }
        else {
            let newUser = new UserModel();
            newUser.email = user.email;
            newUser.username = user.username;
            this.fireAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
            this.fireAuth.createUserWithEmailAndPassword(user.email , user.password).then((r) => {
                    newUser.uid = r.user!.uid!;
                    this.fireAuth.user.subscribe(u => {
                        u?.updateProfile({
                            displayName : newUser.username
                        })
                    })
                }).then(() => {
                    newUser.active = true;
                    this.db.list('users').push(newUser).then((r) => {
                        newUser.key = r.key!;
                        this.db.list('users').update(r.key! , newUser);
                        Swal.fire('Success' , 'You have successfully registered, enjoy chatting!' , 'success').then(() => {
                            this.router.navigate(['Chat'])
                        });
                    }).catch(err => {
                        Swal.fire('Error' , 'Something went horribly wrong..' , 'error');
                        console.log(err.code)
                    })
                })  
            }   
    }
    
    handleGoogleLogin() : void {
        let googleProvider = new firebase.auth.GoogleAuthProvider();
        this.fireAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        this.fireAuth.signInWithPopup(googleProvider).then((r) => {
            r.user?.updateProfile( {
                displayName : r.user.email
            }).then(() => {
                Swal.fire('Success' , 'Enjoy chatting !' , 'success').then( () => {
                }).then(() => {
                    this.router.navigate(['Chat']);
                });
            }).catch(() => {
                Swal.fire('Error' , 'Something went horribly wrong...' , 'error');
            })
        })
    }
}