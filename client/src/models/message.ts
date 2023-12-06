import { IUser } from "./user";

export interface IMessage{
    _id: string;
    sender: IUser;
    recipient: IUser;
    content: string;
    dateRead: Date;
    messageSent: Date;
    files: any[];
    createdAt: Date;
    updatedAt: Date;
} 