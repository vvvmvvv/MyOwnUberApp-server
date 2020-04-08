const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = {
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .min(3)
            .max(50)
            .required(),
        role: Joi.string()
            .min(6)
            .max(50)
            .required()
    };
    return Joi.validate(data, schema);
};

const loginValidation = (data) => {
    const schema = {
        username: Joi.string()
            .min(6)
            .max(40)
            .required(),
        password: Joi.string()
            .min(6)
            .max(50)
            .required()
    };
    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;