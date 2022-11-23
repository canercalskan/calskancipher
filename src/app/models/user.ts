import { MessageModel } from "./message";
import { SessionModel } from "./session";

export class UserModel {
    email! : string;
    password! : string;
    username! : string;
    confirmPassword! : string;
    uid! : string;
    active! : boolean;
    key! : string;
    // sessions : SessionModel[] = [
    //     {
    //         sessionID : '' , 
    //         firstUser : {email : '' , active : false , key : '', uid : '' , username : '' , sessions : [] , confirmPassword : '' , password : ''} , 
    //         endUser : {email : '' , active : false , key : '', uid : '' , username : '' , sessions : [] , confirmPassword : '' , password : ''}, 
    //         conversation : [
    //             {
    //                 content: '' , 
    //                 sender : {email : '' , active : false , key : '', uid : '' , username : '' , sessions : [] , confirmPassword : '' , password : ''}
    //             }
    //         ]
    //     }
    // ];
    sessions : string[] = ['']  
}