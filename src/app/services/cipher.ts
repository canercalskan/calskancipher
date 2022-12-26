import { Injectable, NgModule } from "@angular/core";
import { MessageModel } from "../models/message";

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

    generateRandomKey() : string {
        let generatedString = ''
        while(generatedString.length <= 10) {
            let i = Math.ceil(Math.random() * 10);
            let j = Math.ceil(Math.random() * 10);
            if(i > 4  || j > 4   ) {
                continue;
            }
            else {
                generatedString += this.englishLetters[i][j].toString();
            }
        }
        return generatedString;
    }

    isLetter(currentChar : string) : boolean {
        if(currentChar.length === 1 && currentChar.match(/[a-zA-Z]/)) {
            return true;
        }
        else {
            return false;
        }
    }

    findMod(x : number , y : number) {
        return((x % y) + y) % y;
    }

    encrypt(plaintext : string, key : string) : string {
        let encrypted = '';
        for(let i = 0 , j = 0; i < plaintext.length; i++) {
            let currentChar = plaintext.charAt(i);
            if(this.isLetter(currentChar)) {
                if(currentChar === currentChar.toLowerCase()) { // checking if the current character is in the lowercase form.
                    encrypted += String.fromCharCode(((currentChar.charCodeAt(0) - 97) + (key[j%key.length].toLowerCase().charCodeAt(0) - 97)) % 26+97);
                    j++;
                }
                else if(currentChar === currentChar.toUpperCase()) { // checking if the current character is in the uppercase form.
                    encrypted += String.fromCharCode(((currentChar.charCodeAt(0) - 65) + (key[j%key.length].toUpperCase().charCodeAt(0) - 65)) % 26 + 65);
                    j++; 
                }
            }
            else { // if the current letter is not a letter between a-z or A-Z, it will be pushed to the encrypted variable directly.
                encrypted += currentChar;
            }
        }
        // console.log(encrypted.toUpperCase())
        return encrypted;
    }

    decrypt(ciphertext : string , key : string) : string {
        let decrypted = ''
        for (let i = 0, j = 0; i < ciphertext.length; i++) {
            let currentChar = ciphertext.charAt(i)
             if (this.isLetter(currentChar)) {
                if (currentChar === currentChar.toLowerCase()) {
                    decrypted += String.fromCharCode(this.findMod((currentChar.charCodeAt(0) - 97 ) - ((key[j % key.length].toLowerCase()).charCodeAt(0) - 97), 26) + 97)
                    j++
                } 
                else if(currentChar === currentChar.toUpperCase()){
                    decrypted += String.fromCharCode(this.findMod((currentChar.charCodeAt(0) - 65 ) - ((key[j % key.length].toUpperCase()).charCodeAt(0) - 65), 26) + 65)
                    j++;
                }
            } 
            else {
                decrypted += currentChar
            }
        }

        return decrypted
    }
}