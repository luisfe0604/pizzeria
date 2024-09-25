const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

module.exports = {
    loginSchema
};
