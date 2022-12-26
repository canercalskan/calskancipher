import { UserModel } from "./user";

export class MessageModel {
    content! : string;
    decrypted! : boolean;
    sender! : UserModel;
    time! : string;
    read! : boolean;
}