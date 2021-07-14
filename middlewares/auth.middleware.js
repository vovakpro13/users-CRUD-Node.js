const { models: { Token, User } } = require('../database');
const { tokenService } = require('../services');
const {
    authKeywords: {
        AUTHORIZATION, ACCESS_TOKEN, ACCESS, REFRESH_TOKEN, RESET
    },
} = require('../constants');
const { ErrorHandler } = require('../errors');

module.exports = {
    isLoginOrEmailExist: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await User
                .findOne({ email })
                .select('+password');

            if (!user) {
                ErrorHandler.throwWrongAuthError();
            }

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },

    isEmailActivated: async (req, res, next) => {
        try {
            const { user:  { isActivated } } = req;

            if (!isActivated) {
                ErrorHandler.throwNotActivatedEmail();
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkToken: (type = ACCESS) => async (req, res, next) => {
        try {
            const { id } = req.params;
            const token = req.get(AUTHORIZATION);

            if (!token) {
                ErrorHandler.throwUnauthorized();
            }

            await tokenService.verifyToken(token, type);

            if (type === RESET) {
                req.resetToken = token;

                next();

                return;
            }

            const foundToken = await Token.findOne({[type === ACCESS ? ACCESS_TOKEN : REFRESH_TOKEN]: token});

            if (!foundToken) {
                ErrorHandler.throwUnauthorized();
            }

            if (id && foundToken.user.id !== id) {
                ErrorHandler.throwPermissionDenied();
            }

            req.user = foundToken.user;

            next();
        } catch (e) {
            next(e);
        }
    }
};

