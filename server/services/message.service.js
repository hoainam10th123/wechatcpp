import 'express-async-errors'
import MessageModel from '../models/mesageModel.js'
import { BadRequestError } from '../errors/customError.js'
import { checkConversationExist, updateLatestMessage, addConversation } from './conversation.service.js'

export const createMessage = async (data) => {
    const newConvo = await MessageModel.create(data);
    return newConvo;
}

export const updateDateReadMessage = async (id) => {
    const message = await MessageModel.findByIdAndUpdate(id, {
        dateRead: Date.now(),
    },{ new: true });

    return message;
}

export const getMessages = async (senderId, recipientId) => {
    const data = await MessageModel.find({
        $or: [
            {
                $and: [
                    { recipient: senderId },
                    { sender: recipientId },
                ]
            },
            {
                $and: [
                    { recipient: recipientId },
                    { sender: senderId },
                ]
            },
        ]
    }).populate("sender", "-password")
        .populate("recipient", "-password")
        .sort({ messageSent: -1 })

    return data;
}

export const populateMessage = async (id) => {
    let msg = await MessageModel.findById(id)
        .populate({
            path: "sender",
            select: "displayName picture",
            model: "User",
        })
        .populate({
            path: "recipient",
            select: "displayName picture",
            model: "User",
        });
    if (!msg) throw new BadRequestError(`Failed populateMessage with id: ${id}`)
    return msg;
};

export const addMessage = async ({ senderId, recipientId, message, files }) => {
    const msgData = {
        sender: senderId,
        recipient: recipientId,
        content: message,
        files: files || [],
    };
    const newMessage = await createMessage(msgData);
    const populatedMessage = await populateMessage(newMessage._id);
    const conversation = await checkConversationExist(senderId, recipientId)
    if (conversation.length > 0) {
        await updateLatestMessage(conversation[0]._id, newMessage);
    } else {
        await addConversation({ users: [senderId, recipientId], latestMessage: newMessage })
    }
    return populatedMessage
}