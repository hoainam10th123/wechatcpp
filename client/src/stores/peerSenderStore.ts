import { makeAutoObservable, runInAction } from "mobx";
import SimplePeer from "simple-peer";
import { store } from "./stores";
import { toast } from "react-toastify";

export default class PeerSenderStore {
    peer : any
    remoteStream: any
    data: any

    constructor(){
        makeAutoObservable(this);
    }

    createPeer = (stream: any)=>{        
        this.peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: stream,
        });
        this.peer.on("signal", (data: any) => { 
            store.socketStore.callToUser(store.conversationStore.activeUserchating?._id!, data)
        });
        this.peer.on("stream", (stream: any) => {
            runInAction(()=>{
                this.remoteStream = stream
            })
        });
        this.peer.on('close', () => {
            toast.error('Peer close')
        })
        this.peer.on('error', (err:any) => {
            console.error(err)
            toast.error(err.message)
        })
    }

    setSignalData=(data: any)=>{
        this.data = data
    }

    setNull = ()=>{
        this.peer = null
        this.remoteStream = null
    }
}