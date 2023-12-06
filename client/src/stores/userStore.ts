import { makeAutoObservable, reaction, runInAction } from "mobx";
import { IUser } from "../models/user";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "./stores";


export default class UserStore {
    user: IUser | null = JSON.parse(localStorage.getItem('user')!);
    token: string | null = localStorage.getItem('token');

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.user,
            user => {
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user))
                } else {
                    localStorage.removeItem('user')
                }
            }
        )

        reaction(
            () => this.token,
            token => {
                if (token) {
                    localStorage.setItem('token', token)
                } else {
                    localStorage.removeItem('token')
                }
            }
        )
    }

    login = async (email: string, password: string) => {
        try {
            const data = await agent.User.login({ email, password });
            runInAction(() => {
                this.token = data.token;
                this.user = data.user;
            })
            store.socketStore.createConnection()
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    register = async (data: any) => {
        try {
            const dataTemp = await agent.User.register(data);
            runInAction(() => {
                this.token = dataTemp.token;
                this.user = dataTemp.user;
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    logout = async () => {
        try {
            const data = await agent.User.logout()
            runInAction(() => {
                this.user = null
                this.token = null
            })
            store.socketStore.disconnect()
            toast.info(data.msg)
            router.navigate('/login')
        } catch (error) {
            console.error(error)
            toast.error('Error when logout')            
        }
    }
}