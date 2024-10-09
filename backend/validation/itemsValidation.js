const Joi = require('joi');

const createItemSchema = Joi.object({
    name: Joi.string().required(),
    value: Joi.number().min(0).required(),
    type: Joi.string().required(),
    active: Joi.boolean()
});

const alterItemSchema = Joi.object({
    name: Joi.string().required(),
    value: Joi.number().min(0).required(),
    type: Joi.string().required(),
    active: Joi.boolean()
});

const idSchema = Joi.object({
    type: Joi.string().required(),
});

module.exports = {
    createItemSchema,
    idSchema,
    alterItemSchema
};
