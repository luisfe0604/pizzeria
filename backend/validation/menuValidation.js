const Joi = require('joi');

const createItemSchema = Joi.object({
    name: Joi.string().required(),
    ingredients: Joi.string().required(),
    P: Joi.number().min(0).required(),
    M: Joi.number().min(0).required(),
    G: Joi.number().min(0).required(),
    B: Joi.number().min(0).required(),
    active: Joi.boolean()
});

const alterItemSchema = Joi.object({
    name: Joi.string().required(),
    ingredients: Joi.string().required(),
    P: Joi.number().min(0).required(),
    M: Joi.number().min(0).required(),
    G: Joi.number().min(0).required(),
    B: Joi.number().min(0).required(),
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
