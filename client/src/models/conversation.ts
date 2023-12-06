import { IMessage } from "./message";
import { IUser } from "./user";

export interface IConversation{
    _id: string;
    users: IUser[];
    latestMessage: IMessage;
    createdAt: Date;
}