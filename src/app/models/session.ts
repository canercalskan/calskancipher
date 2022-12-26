import { UserModel } from './user';
import { MessageModel } from './message';

export class SessionModel {
  firstUser!: UserModel;
  endUser!: UserModel;
  sessionID!: string;
  conversation_key!: string;
  conversation: MessageModel[] = [
    {
      content: ' ',
      sender: {
        uid: ' ',
        username: ' ',
        email: ' ',
        password: ' ',
        confirmPassword: ' ',
        sessions: [],
        blockedUsers : [],
        active: false,
        key: ' ',
        profilePicture : ' ',
        showNotification : false,
      },
      time : ' ',
      read : false,
      decrypted : false,
    },
  ];
}
