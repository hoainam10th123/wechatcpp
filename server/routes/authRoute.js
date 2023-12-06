import { Router } from 'express'
import 'express-async-errors'
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';
import { UnauthorizedError } from '../errors/customError.js';
import userModel from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'
import { createJWT, verifyJWT } from '../utils/tokenUtils.js';

const router = Router()

const oneDay = '1d'

router.post('/register', validateRegister, async (req, res) => {
    const { password } = req.body;

    req.body.password = await hashPassword(password)

    const user = await userModel.create(req.body)

    const token = createJWT({
        userId: user._id,
        email: user.email
    }, oneDay, process.env.JWT_SECRET)

    const refresh_token = createJWT({
        userId: user._id,
        email: user.email
    }, '30d', process.env.REFRESH_TOKEN_SECRET)

    const thirtyDay = 1000 * 60 * 60 * 24 * 30;

    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        expires: new Date(Date.now() + thirtyDay),
        secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: "register success.", user, token })
});

router.post('/login', validateLogin, async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })
    if (!user) throw new UnauthorizedError('Email is not exist')

    const isPasswordCorrect = await comparePassword(password, user.password)
    if (!isPasswordCorrect) throw new UnauthorizedError('Invalid password')

    const token = createJWT({
        userId: user._id,
        email: user.email
    }, oneDay, process.env.JWT_SECRET)

    const refresh_token = createJWT({
        userId: user._id,
        email: user.email
    }, '30d', process.env.REFRESH_TOKEN_SECRET)

    const thirtyDay = 1000 * 60 * 60 * 24 * 30;

    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        expires: new Date(Date.now() + thirtyDay),
        secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: "login success.", user, token })
});

router.get('/logout', (req, res) => {
    res.clearCookie("refreshtoken")
    res.status(200).json({ msg: 'user logged out!' });
});

router.post('/refreshToken', async (req, res) => {
    const refresh_token = req.cookies.refreshtoken;
    if (!refresh_token) throw new UnauthorizedError('Unauthorized');

    try {
        // test bang cach cho thoi gian refresh_token 1m
        const { email } = verifyJWT(refresh_token, process.env.REFRESH_TOKEN_SECRET);

        const user = await userModel.findOne({ email })        
        if (!user) throw new UnauthorizedError('Unauthorized')

        const token = createJWT({
            userId: user._id,
            email: user.email
        }, oneDayToken, process.env.JWT_SECRET)

        res.status(200).json({ token })

    } catch (error) {
        throw new UnauthorizedError('Unauthorized');
    }
});

export default router