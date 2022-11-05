import { Component } from "@angular/core";
import { AngularFireDatabase } from '@angular/fire/compat/database'
import { CipherService } from "src/app/services/cipher";

@Component({
    selector : 'home',
    templateUrl : './home.component.html',
    styleUrls : ['./home.component.css']
})

export class HomeComponent {
    constructor(private CipherService : CipherService){
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
}