import { Router } from 'express'
import { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError } from '../errors/customError.js';
import {validation} from '../middleware/validationMiddleware.js'

const router = Router()

router.get('/BadRequest', (req, res) => {
    throw new BadRequestError('BadRequest');
});

router.get('/NotFound', (req, res) => {
    throw new NotFoundError('NotFound');
});

router.get('/Unauthorized', (req, res) => {
    throw new UnauthorizedError('Unauthorized, please login again');
});

router.get('/Forbidden', (req, res) => {
    throw new ForbiddenError('Forbidden');
});

router.get('/ServerError', (req, res) => {
    throw new Error('Server error')
});

router.get('/Validation', validation, (req, res) => {
    res.status(200).json({message: 'validation OK'})
});

export default router