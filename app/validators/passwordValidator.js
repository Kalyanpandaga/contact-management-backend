import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required()
    .messages({
      'string.empty': 'Password is required',
      'string.pattern.base': 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
    }),
  email: Joi.string().required()
   .messages({
    'string.empty': 'email is required'
    }),
  otp: Joi.string().required()
  .messages({
   'string.empty': 'email is required'
   }),
});
