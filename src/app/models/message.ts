import { UserModel } from "./user";

export class MessageModel {
    content! : string;
    sender! : UserModel;
}