class MyUserConnection {
    constructor() {
        this.usersOnline = [];
    }

    userConnected(username, connectionId){
        let user = this.usersOnline.find(x=>x.username === username)
        if(user){
            user.connectionIds.push(connectionId)
        }else{
            this.usersOnline.push({username, connectionIds:[connectionId]})
        }
    }

    userDisconnected(username, connectionId){
        let user = this.usersOnline.find(x=>x.username === username)
        if(user){
            user.connectionIds = user.connectionIds.filter(x=>x !== connectionId)
            if(user.connectionIds.length === 0){
                this.usersOnline = this.usersOnline.filter(x=>x.username !== username)
            }
        }
    }

    getOnlineUsers(){
        return this.usersOnline
    }

    getConnectionsForUser(username){
        const user = this.usersOnline.find(x=>x.username === username)
        if(user) return user.connectionIds
        return []
    }
}

export default new MyUserConnection()