import { generateGroupName } from "./utils/generateGroup.js";
import { getMessages, addMessage, updateDateReadMessage } from './services/message.service.js'
import MyUserConnection from './models/myUserConnect.js'
import { findUserById, getUsers } from './services/user.service.js'
import { writeFile } from "fs";


export default async function (socket, io) {
    let senderId
    if (socket.user) {
        senderId = socket.user.userId// socket.user get from middleware
        MyUserConnection.userConnected(senderId, socket.id)
        console.log('User Connect: ')
        console.log(MyUserConnection.getOnlineUsers())
        const user = await findUserById(senderId)

        //To all connected clients except the sender
        socket.broadcast.emit("UserIsOnline", user);

        const usersOnline = MyUserConnection.getOnlineUsers()
        const users = await getUsers(usersOnline)
        //emit back to sender
        socket.emit("GetOnlineUsers", users);
    }

    //join a conversation room
    socket.on("join conversation", async (idUserNhan) => {
        if (senderId) {
            const groupName = generateGroupName(senderId, idUserNhan)
            socket.join(groupName);
            const messages = await getMessages(senderId, idUserNhan)
            //emit back to sender
            socket.emit("receive all message", messages);
        }
    });

    //send and receive message
    socket.on("send message", async (data) => {
        const { content, userNhan } = data
        const mess = await addMessage({
            senderId: senderId,
            recipientId: userNhan,
            message: content,
            files: []
        })

        const senderUser = await findUserById(senderId)

        const groupName = generateGroupName(senderId, userNhan)
        io.to(groupName).emit("NewMessage", mess)

        const connections = MyUserConnection.getConnectionsForUser(userNhan)
        if (connections.length > 0) {
            connections.forEach(socketid => {
                io.to(socketid).emit("NewMessageReceived", senderUser.displayName)
            });
        }
    });

    //typing
    socket.on("typing", (recipientId) => {
        const groupName = generateGroupName(senderId, recipientId)
        // to all clients in room1 except the sender
        //socket.to(groupName).emit("typing", "");
        socket.in(groupName).emit("typing");
    });

    socket.on("stop typing", (recipientId) => {
        const groupName = generateGroupName(senderId, recipientId)
        // to all clients in room1 except the sender
        socket.to(groupName).emit("stop typing");
    });

    socket.on("seen message", async (recipientId, messageId) => {
        await updateDateReadMessage(messageId)
        const groupName = generateGroupName(senderId, recipientId)
        // to all clients in room1 except the sender
        socket.to(groupName).emit("onSeenMessage")
    });

    // co the gom signalData chung event nay
    socket.on("call to user", async (recipientId, data) => {
        const sender = await findUserById(senderId)
        const connections = MyUserConnection.getConnectionsForUser(recipientId)

        if (connections.length > 0) {
            // ban toi userRecipient
            connections.forEach(socketid => {
                io.to(socketid).emit("onNhanCuocGoi", sender, data)
            });
        }
    });

    socket.on("answerCall", (recipientId, data) => {
        const connections = MyUserConnection.getConnectionsForUser(recipientId)
        if (connections.length > 0) {
            // ban toi userRecipient
            connections.forEach(socketid => {
                io.to(socketid).emit("acceptedCall", data)
            });
        }
    });

    socket.on("upload", async (data, callback) => {
        const { recipientId, files } = data
        const senderUser = await findUserById(senderId)
        const fileNameTemp = []

        files.forEach(fData => {
            //save the content to the disk            
            writeFile(`./wwwroot/upload/${fData.fileName}`, fData.file, async (err) => {
                if (err) {//co loi
                    callback({ message: err.message });
                    return
                } else {
                    fileNameTemp.push(`upload/${fData.fileName}`)
                    if (fileNameTemp.length === files.length) {
                        const mess = await addMessage({
                            senderId,
                            recipientId,
                            message: '',
                            files: fileNameTemp
                        })
                        const groupName = generateGroupName(senderId, recipientId)
                        io.to(groupName).emit("NewMessage", mess)

                        const connections = MyUserConnection.getConnectionsForUser(recipientId)
                        if (connections.length > 0) {
                            connections.forEach(socketid => {
                                io.to(socketid).emit("NewMessageReceived", senderUser.displayName)
                            });
                        }
                        callback({ message: "upload file success" });
                    }
                }
            });
        })
    });

    socket.on("leaveRoom", (idUserNhan) => {
        const room = generateGroupName(senderId, idUserNhan)
        socket.leave(room);
    });

    socket.on("disconnect", async (reason) => {
        MyUserConnection.userDisconnected(senderId, socket.id)
        console.log('User DisConnect: ')
        console.log(MyUserConnection.getOnlineUsers())
        const userOffline = await findUserById(senderId)
        //To all connected clients except the sender
        socket.broadcast.emit("UserIsOffline", userOffline);
    });
}