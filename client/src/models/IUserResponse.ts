import { IUser } from "./user";

export interface IUserResponse{
    user: IUser;
    token: string;
}