import { DeclareVarStmt } from "@angular/compiler";
import { Injectable, NgModule } from "@angular/core";

@Injectable({providedIn : "root"})
@NgModule()

export class CipherService {

    englishLetters : string[][] = [
        ['A' , 'B' , 'C' , 'D' , 'E'],
        ['F' , 'G' , 'H' , 'I' , 'K'], 
        ['L' , 'M' , 'N' , 'O' , 'P'],
        ['Q' , 'R' , 'S' , 'T' , 'U'],
        ['V' , 'W' , 'X' , 'Y' , 'Z'],
    ]

    xorCipher(message : string) : void {

    }

    polybiusCipher(message : string) : string[] {
        //input message'ı objeye veya modele çek, whitespaces arrayini attribute olarak tanımla, decipher ederken
        //whitespace eklemenin bi yolunu bul. 
        let i , j , k;
        let encrypted : string[] = [];
        let whiteSpaces : number[] = []
        for(i = 0; i < message.length; i++) {
            if(message[i] === ' ') {
                whiteSpaces.push(i+1);
            }
            for(j = 0; j < 5 ; j++) {
                for(k = 0; k < 5 ; k++) {
                    if(message[i] .toUpperCase() === this.englishLetters[j][k]) {
                        encrypted.push((j+1).toString() + (k+1).toString())
                    }
                }
            }
        }
        return encrypted;
    }

    polybiusDeCipher(encrypted : string) : void {
        let decrypted : string = '';
        for(let i = 0; i<encrypted.length; i++) {
            decrypted += this.englishLetters[(+encrypted[i])-1][(+encrypted[i+1])-1];
            i++;
        }
        console.log(decrypted);
    }

    monoalphabeticCipher() : void {}

    ceasarCipher() : void {}

    bitshiftCipher() : void {}

}