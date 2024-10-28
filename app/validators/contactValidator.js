import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must be at most 30 characters',
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email is required',
    }),
   phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required()
   .messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Phone number must be a 10-digit number',
  }),
  address: Joi.string().required()
    .messages({
      'string.empty': 'address is required',
      'string.pattern.base': 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
    }),
   timezone: Joi.string().required()
   .messages({
    'string.empty': 'timezone is required'
  }),
});