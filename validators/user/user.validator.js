const Joi = require('joi');

const userKeys = require('./userValidKeys');
const { regexp } = require('../../constants');

module.exports = {
    createUser: Joi.object().keys({
        firstName: userKeys.firstName.required(),
        lastName: userKeys.lastName.required(),
        address: userKeys.address.required(),
        email: userKeys.email.required(),
        password: Joi.string().regex(regexp.PASSWORD).max(256).required(),
    }),

    updateUserData: Joi.object().keys(userKeys).min(1),
};
