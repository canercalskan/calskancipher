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
    sessions : string[] = [''];
    blockedUsers : string[] = [' '];  
    profilePicture! : string;
}