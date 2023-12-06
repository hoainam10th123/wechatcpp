import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ConversationStore from "./conversationStore";
import SeenMessageStore from "./seenMessageStore";
import SocketStore from "./socketStore";
import PeerSenderStore from "./peerSenderStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    conversationStore: ConversationStore;
    seenMessageStore: SeenMessageStore;
    socketStore: SocketStore;
    peerSenderStore: PeerSenderStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    conversationStore: new ConversationStore(),
    seenMessageStore: new SeenMessageStore(),
    socketStore: new SocketStore(),
    peerSenderStore: new PeerSenderStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}