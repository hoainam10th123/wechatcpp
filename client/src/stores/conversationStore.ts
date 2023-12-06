import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { IConversation } from "../models/conversation";
import { IUser } from "../models/user";


export default class ConversationStore {
    conversations: IConversation[] = []
    loading: boolean = true
    activeUserchating: IUser | null = null


    constructor() {
        makeAutoObservable(this);
    }

    getConversations = async () => {
        try {
            const data = await agent.Conversations.getConversations();
            //disabled warning in consle.log
            runInAction(() => {
                this.conversations = data
            })            
            this.setLoading(false);
        } catch (error) {
            console.error(error)
        }
    }

    setLoading = (val: boolean) => {
        this.loading = val;
    }

    setActiveUserChating = (user: IUser) => {
        this.activeUserchating = user
    }

    clearAllData = () =>{
        this.activeUserchating = null
        this.conversations = []
    }
}