const Joi = require('joi');

const createItemSchema = Joi.object({
    name: Joi.string().required(),
    ingredients: Joi.string().required(),
    value: Joi.number().min(0).required()
});

const alterItemSchema = Joi.object({
    name: Joi.string().required(),
    ingredients: Joi.string().required(),
    value: Joi.number().min(0).required(),
    active: Joi.boolean()
});

const idSchema = Joi.object({
    id: Joi.number().integer().min(1).required()
});

module.exports = {
    createItemSchema,
    idSchema,
    alterItemSchema
};
