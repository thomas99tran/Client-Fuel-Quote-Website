const Joi = require("joi")

const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(2)
        .max(50)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
})

const accountSchema = Joi.object({
    fullName: Joi.string()
        .alphanum()
        .min(2)
        .max(50)
        .required(),
    Address1: Joi.string()
        .alphanum()
        .min(2)
        .max(50)
        .required(),
    Address2: Joi.string()
        .alphanum()
        .optional()
        .allow(""),
    City: Joi.string()
        .alphanum()
        .min(2)
        .max(20)
        .required(),
    
    states: Joi.string()
        .alphanum()
        .required(),

    Zipcode: Joi.string()
        .required()
})

const fuelSchema = Joi.object({
    gallons: Joi.number()
        .required(),
    deliveryAddress: Joi.string()
        .alphanum()
        .min(2)
        .max(50)
        .required(),
    deliveryDate: Joi.date()
        .required(),
    price: Joi.number()
        .required(),
    total: Joi.number()
        .required()
})

module.exports = {
    accountSchema,
    fuelSchema,
    userSchema
}