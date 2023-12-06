import { makeAutoObservable, runInAction } from "mobx";
import { io } from "socket.io-client";
import { IMessage } from "../models/message";
import { toast } from "react-toastify";
import { IUser } from "../models/user";
import { store } from "./stores";

// interface FileBase64{
//     file: File
//     imgData: string | ArrayBuffer | null | undefined
// }

export interface Files{
    file: File;
    fileName: string;
}

export default class SocketStore {
    socket: any;
    messages: IMessage[] = []
    usersOnline: IUser[] = []
    isTyping: boolean = false
    files: Files[] = []
    isSeen: boolean = false
    signalData: any

    constructor() {
        makeAutoObservable(this);
    }

    get IsConnected(): boolean {
        if (this.socket) return this.socket.connected;
        return false
    }

    createConnection = () => {
        this.socket = io(process.env.REACT_APP_API_URL?.split('/api/v1')[0]!, {
            transports: ["websocket"],            
            auth: {
                token: localStorage.getItem('token')
            }            
        });

        this.socket.on("connect", () => {
            //toast.info(`${this.socket.id} is connected`)
        });

        this.socket.on("receive all message", (msgs: IMessage[]) => {
            runInAction(() => {
                this.messages = msgs.reverse()
            })
        });

        this.socket.on("NewMessage", (message: IMessage) => {
            runInAction(() => {                
                this.isSeen = false
            })
            this.messages.push(message)
        });

        this.socket.on("NewMessageReceived", (displayName: string) => {
            //toast.info(`You have a new message from ${displayName}`)
        });

        this.socket.on("UserIsOnline", (user: IUser) => {
            this.usersOnline.push(user)
            toast.info(`${user.displayName} online`)
        });

        this.socket.on("UserIsOffline", (user: IUser) => {
            runInAction(() => {
                this.usersOnline = this.usersOnline.filter(x => x._id !== user._id)
            })
            toast.info(`${user.displayName} offline`)
        });

        this.socket.on("GetOnlineUsers", (users: IUser[]) => {
            runInAction(() => {
                this.usersOnline = users
            })
        });

        // test socketio
        this.socket.on("send all message", (data: any) => {
            toast.info(`${data.userid} ${data.message}`)
        });

        this.socket.on("stop typing", () => {
            runInAction(() => {
                this.isTyping = false
            })
        });

        this.socket.on("typing", () => {
            runInAction(() => {
                this.isTyping = true
            })
        });

        this.socket.on("onSeenMessage", () => {
            runInAction(() => {
                this.isSeen = true
            })
        });

        this.socket.on("onNhanCuocGoi", (fromUser: IUser, data: any) => {
            // luu thong tin nguoi goi va data tu nguoi gui 
            runInAction(()=>{
                this.signalData = data
            })
            store.commonStore.setGoiTuUser(fromUser)
            // mo hop thoai hoi tra loi hay huy cuoc goi
            store.commonStore.setOpenDialog(true)            
        });

        this.socket.on("acceptedCall", (data: any) => {
            store.commonStore.setClearIntervalTime(true)
            store.peerSenderStore.setSignalData(data)
        });

        this.socket.on("disconnect", (reason: any) => {
            toast.info(reason)
        });

        this.socket.on("connect_error", (err: any) => {
            toast.error(err.message)
        });
    }

    joinConversation = (idNhan: string) => {
        this.socket.emit("join conversation", idNhan)
    }

    sendMsg = (content: string, userNhan: string) => {
        this.socket.emit("send message", { content, userNhan })
    }

    clearMessages = () => {
        this.messages = []
    }

    leaveRoom = (recipientId: string) => {
        this.socket.emit("leaveRoom", recipientId)
    }

    typeing = (recipientId: string) => {
        this.socket.emit("typing", recipientId)
    }

    stopTypeing = (recipientId: string) => {
        this.socket.emit("stop typing", recipientId)
    }

    seenMessage = (recipientId: string, messageId: string) => {
        this.socket.emit("seen message", recipientId, messageId)
    }

    sendFile = (files: Files[], recipientId: string) => {
        this.socket.emit("upload", {files, recipientId}, (status: any) => {
            console.log(status);
            toast.error(status.message)
        });
    }

    callToUser = (recipientId: string, data: any) => {        
        this.socket.emit("call to user", recipientId, data)
    }

    // addFile = (file:FileBase64)=>{
    //     this.files.push(file)
    // }

    clearFiles = () => {
        this.files = []
    }

    setSeenMessage = (val: boolean) => {
        this.isSeen = val
    }

    disconnect = () => {
        this.socket.removeAllListeners()
        this.socket.disconnect()
    }

    answerCall = (recipientId: string, data: any)=>{        
        this.socket.emit("answerCall", recipientId, data)
    }
}