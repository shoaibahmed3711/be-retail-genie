import Joi from 'joi';

export const authSchema = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('freeParent', 'memberParent', 'freeSchool', 'memberSchool', 'admin'),
    schoolId: Joi.string().when('role', {
      is: Joi.string().valid('freeSchool', 'memberSchool'),
      then: Joi.required()
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    password: Joi.string().min(6).required()
  })
}; 