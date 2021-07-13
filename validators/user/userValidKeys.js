const Joi = require('joi');
const { userRolesEnum, regexp } = require('../../constants');

module.exports = {
    firstName: Joi.string().min(3).max(200),
    lastName: Joi.string().min(3).max(200),
    address: Joi.string().min(20).max(500),
    email: Joi.string().regex(regexp.EMAIL)
};
