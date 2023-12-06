import { Router } from 'express'
import 'express-async-errors'
import trimRequest from 'trim-request'
import { authorized } from '../middleware/authMiddleware.js'
import { checkConversationExist, getConversations, addConversation } from '../services/conversation.service.js'
import { validateConversationsBodyPost } from '../middleware/validationMiddleware.js'
import { createMessage } from '../services/message.service.js'

const router = Router()

// thu tu middleware la quan trong chay tu trai qua phai
router.post('/', [authorized, trimRequest.body, validateConversationsBodyPost, async (req, res) => {
    const senderId = req.user.userId
    const { receiverId, files } = req.body
    // kiem tra neu doan chat ton tai
    const existConver = await checkConversationExist(senderId, receiverId)
    if (existConver.length > 0) {
        res.json(existConver)
    } else {
        const msgData = {
            sender: senderId,
            recipient: receiverId,
            content: 'test message 1',
            files: files || [],
        };
        const newMessage = await createMessage(msgData);
        const conversation = await addConversation({ users: [senderId, receiverId], latestMessage: newMessage })
        res.json(conversation)
    }
}]);

router.get('/', authorized, async (req, res) => {
    const user_id = req.user.userId;
    const conversations = await getConversations(user_id);
    res.json(conversations);
})

export default router