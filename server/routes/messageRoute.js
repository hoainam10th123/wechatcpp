import 'express-async-errors'
import { Router } from 'express'
import trimRequest from 'trim-request'
import { validateMessageBodyGet, validateMessageBodyPost } from '../middleware/validationMiddleware.js'
import { createMessage, populateMessage, getMessages } from '../services/message.service.js'
import { updateLatestMessage, checkConversationExist, addConversation } from '../services/conversation.service.js'


const router = Router()

router.post('/', [trimRequest.body, validateMessageBodyPost, async (req, res) => {
    const senderId = req.user.userId;
    const { message, recipientId, files } = req.body;

    const { io, socket } = req.app.get("socketio");

    const msgData = {
      sender: senderId,
      recipient: recipientId,
      content: message,
      files: files || [],
    };
    let newMessage = await createMessage(msgData);
    let populatedMessage = await populateMessage(newMessage._id);
    const conversation = await checkConversationExist(senderId, recipientId)
    if(conversation.length > 0){
      await updateLatestMessage(conversation[0]._id, newMessage);
    }else{
      await addConversation({users: [senderId, recipientId], latestMessage: newMessage})
    }

    // to all connected clients
    io.emit("send all message", {message:'succcess', userid: 'hoainam10th'})

    // to all clients in the current namespace except the sender
    //socket.broadcast.emit(/* ... */);
    res.json(populatedMessage);
}]);

router.get('/', validateMessageBodyGet, async (req, res) => {
  const senderId = req.user.userId
  const { recipientId } = req.body
  const messages = await getMessages(senderId, recipientId)
  res.json(messages)
});

export default router