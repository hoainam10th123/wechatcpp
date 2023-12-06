import { verifyJWT } from '../utils/tokenUtils.js';
import { UnauthorizedError, ForbiddenError } from '../errors/customError.js';

export const authorized = (req, res, next) => {
    //console.log(req.baseUrl) // /api/jobs
    // if (req.baseUrl === '/api/jobs' && req.method === 'GET' && req.url === '/') {
    //     throw new UnauthorizedError('authentication invalid');
    // }    

    const bearerToken = req.headers["authorization"]
    if(!bearerToken) throw new UnauthorizedError('invalid token');

    try {
        const token = bearerToken.split(' ')[1]
        const { userId, email } = verifyJWT(token, process.env.JWT_SECRET);
        // req.user: su dung cho cac request khac
        req.user = { userId, email };
        next();
    } catch (error) {
        throw new UnauthorizedError('authentication invalid');
    }
};

export const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError('Unauthorized to access this route');
        }
        next();
    };
};