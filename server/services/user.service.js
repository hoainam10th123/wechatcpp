import 'express-async-errors'
import UserModel from '../models/userModel.js';
import { NotFoundError } from '../errors/customError.js';


export const findUserById = async (id) => {
    const user = await UserModel.findById(id).select("_id displayName picture")
    if (!user) throw new NotFoundError(`Can not find user with id: ${id}`)
    return user;
}

export const getUsers = async (users) => {
    const userItems = await Promise.all(
        users.map(async (item) => {
            const usr = await findUserById(item.username)// username la _id
            return usr;
        })
    )    
    return userItems;
}

export const updateLastActiveByUserId = async (id) => {
    const user = await UserModel.findByIdAndUpdate(id, {
        lastActive: Date.now(),
    },{ new: true });

    return user;
}