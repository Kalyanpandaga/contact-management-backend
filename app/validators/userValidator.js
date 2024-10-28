import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
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
  password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required()
    .messages({
      'string.empty': 'Password is required',
      'string.pattern.base': 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
    })
});
