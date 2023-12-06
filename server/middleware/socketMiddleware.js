import { UnauthorizedError } from "../errors/customError.js";
import { verifyJWT } from "../utils/tokenUtils.js";
import { updateLastActiveByUserId } from '../services/user.service.js'

export const socketMiddleware = async (socket, next) => {
    
    try {        
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        console.log(token)
        const { userId, email } = verifyJWT(token, process.env.JWT_SECRET);
        socket.user = { userId, email };
        if(userId)
            await updateLastActiveByUserId(userId)
        next();
    } catch (error) {
        console.log(error)
        const err = new UnauthorizedError('Invalid token at socket')
        next(err);
    }
}

export const socketErrorMiddleware = (req, res, next) => {
    next()
}