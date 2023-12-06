import { body, validationResult, param, query } from 'express-validator'
import { BadRequestError } from '../errors/customError.js'
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';


const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

//validation test api
export const validation = withValidationErrors([
  body('company').notEmpty().withMessage('company not empty').isLength({ min: 3 })
    .withMessage('company min is 3 length'),
  body('position').notEmpty().withMessage('position not empty'),
])

export const validateRegister = withValidationErrors([
  body('displayName').notEmpty().withMessage('DisplayName not empty').isLength({ min: 3 })
    .withMessage('DisplayName min is 3 length'),
  body('email').notEmpty().withMessage('email not empty').isEmail().withMessage('invalid email format')
  .custom(async (email) => {
    const user = await userModel.findOne({ email });
    if (user) {
      throw new BadRequestError('email already exists');
    }
  }),
  body('password').notEmpty().withMessage('password not empty')
  .isLength({min: 6, max: 128}).withMessage('password min = 6, max = 128'),
  body('status').isLength({max: 64}).withMessage('status max = 64 charactor'),
])

export const validateLogin = withValidationErrors([
  body('email').notEmpty().withMessage('email not empty').isEmail().withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password not empty')
  .isLength({min: 6, max: 128}).withMessage('password min = 6, max = 128'),
])

export const validateConversationsBodyPost = withValidationErrors([
  body('receiverId').notEmpty().withMessage('required receiverId').custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError('invalid receiverId MongoDB id');   
  }),
]);

// bat buoc phai co async (.custom(async)
export const validateMessageBodyPost = withValidationErrors([
  body('message').notEmpty().withMessage('message not empty'),
  body('recipientId').notEmpty().withMessage('required recipientId').custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError('invalid recipientId MongoDB id');   
  }),
]);

export const validateMessageBodyGet = withValidationErrors([
  body('recipientId').notEmpty().withMessage('required recipientId').custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');   
  }),
]);

export const validateSearchUser = withValidationErrors([
  query('search').notEmpty().withMessage('required search key')
  //.isLength({min: 3}).withMessage('minimum length is >= 3 character')
])