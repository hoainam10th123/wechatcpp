import 'express-async-errors'
import { Router } from 'express'
import trimRequest from 'trim-request'
import { validateSearchUser } from '../middleware/validationMiddleware.js'
import UserModel from '../models/userModel.js'

const router = Router()

router.get('/', [trimRequest.query, validateSearchUser, async (req, res) => {
    const keyWord = req.query.search
    const users = await UserModel.find({
        $or: [
            {name: {$regex: keyWord, $options: 'i'}},
            {email: {$regex: keyWord, $options: 'i'}},
        ]
    })
    res.json(users)
}]);

export default router