const Joi = require('joi');

const { regexp: { PASSWORD } } = require('../../constants');
const userKeys = require('../user/userValidKeys');

module.exports = {
    logIn: Joi.object().keys({
        email: userKeys.email,
        password: Joi.string().max(200).required()
    }),
    resetPasswordBody: Joi.object().keys({
        newPassword: Joi.string().regex(PASSWORD).max(256)
    })
};
