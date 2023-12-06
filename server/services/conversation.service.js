import 'express-async-errors'
import conversationModel from '../models/conversationsModel.js'
import { BadRequestError } from '../errors/customError.js'
import userModel from '../models/userModel.js'

export const addConversation = async (data) => {
    const newConvo = await conversationModel.create(data);
    return newConvo;
}

export const getConversations = async (user_id) => {
    let conversations;
    await conversationModel.find({
        users: { $elemMatch: { $eq: user_id } },
    })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await userModel.populate(results, {
                path: "latestMessage.sender",
                select: "displayName email picture status",
            });
            conversations = results;
        })
        .catch((err) => {
            throw new BadRequestError(`Can not find conversation with userId: ${user_id}`);
        });
    return conversations;
};

export const updateLatestMessage = async (convo_id, data)=>{
    const updatedConvo = await conversationModel.findByIdAndUpdate(convo_id, {
        latestMessage: data,
    },{ new: true });

    return updatedConvo
}

export const checkConversationExist = async (senderId, receiverId) => {
    let conversations = await conversationModel.find({
        $and: [
            { users: { $elemMatch: { $eq: senderId } } },
            { users: { $elemMatch: { $eq: receiverId } } }
        ]
    }).populate('users', '-password').populate('latestMessage')

    return conversations;
}