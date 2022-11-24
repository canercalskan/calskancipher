import { UserModel } from './user';
import { MessageModel } from './message';

export class SessionModel {
  firstUser!: UserModel;
  endUser!: UserModel;
  sessionID!: string;
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
        active: false,
        key: ' ',
      },
    },
  ];
}
