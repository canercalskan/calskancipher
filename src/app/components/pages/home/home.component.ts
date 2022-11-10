import { Component } from "@angular/core";
import { AngularFireDatabase } from '@angular/fire/compat/database'
import { CipherService } from "src/app/services/cipher";
import { Router } from "@angular/router";
@Component({
    selector : 'home',
    templateUrl : './home.component.html',
    styleUrls : ['./home.component.css']
})

export class HomeComponent {
    constructor(private CipherService : CipherService , private router : Router){
    }
    handleCipherForm(message : any) : void {
        let displayResult : string = '';
        this.CipherService.polybiusCipher(message.inp).forEach(char => {
            displayResult += char;
        })
        console.log(displayResult);
    }

    handleDeCipherForm(message : any) : void {
        let displayResult : string = '';
        let s : string = '';
        this.CipherService.polybiusDeCipher(message.inp)
    }
    getStarted() : void {
        this.router.navigate(['Login'])
    }
}