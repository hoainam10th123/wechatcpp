import { makeAutoObservable } from "mobx";

export default class SeenMessageStore {
   lastSeenDate: Date | null = null;

    constructor() {
        makeAutoObservable(this);        
    }

    setLastSeenDate = (data: Date) => {
        this.lastSeenDate = data;
    }
}