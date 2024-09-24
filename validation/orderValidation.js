const Joi = require('joi');

const createOrderSchema = Joi.object({
    items: Joi.array().items(Joi.number().integer()).required(),
    locale: Joi.string().required(),
    client: Joi.string().required()
});

const finishOrderSchema = Joi.object({
    value: Joi.number().min(0).required()
});

const idSchema = Joi.object({
    id: Joi.number().integer().min(1).required()
});

const timestampSchema = Joi.object({
    startTimestamp: Joi.date().iso().required(),
    endTimestamp: Joi.date().iso().greater(Joi.ref('startTimestamp')).required()
});

module.exports = {
    createOrderSchema,
    idSchema,
    timestampSchema,
    finishOrderSchema
};