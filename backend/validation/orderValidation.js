const Joi = require('joi');

const createOrderSchema = Joi.object({
    items: Joi.array().items(Joi.string()).required(),
    other_items: Joi.array().items(Joi.string()),
    borders: Joi.array().items(Joi.string()).required(),
    locale: Joi.string().required(),
    client: Joi.string().required(),
    observations: Joi.string()
});

const finishOrderSchema = Joi.object({
    value: Joi.number().min(0).required(),
    status: Joi.boolean()
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
