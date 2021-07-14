const { authService, tokenService, mailService } = require('../services');
const { passwordHasher, dataNormalizators: { userNormalize } } = require('../helpers');
const { ErrorHandler } = require('../errors');
const {
    responseCodes,
    frontendEndpoints: { PROFILE, RESET_PASSWORD_FORM },
    authKeywords: { CREATE_TOKENS, REWRITE_TOKENS },
    emailActions: { RESET_PASSWORD },
} = require('../constants');
const { models: { User, Token } } = require('../database');

module.exports = {
    logIn: async (req, res, next) => {
        try {
            const { body: { password }, user } = req;

            await Token.deleteMany({ user: user.id });
            await passwordHasher.compare(password, user.password);

            userNormalize(user);

            await _sendTokens(res, user, CREATE_TOKENS);
        } catch (e) {
            next(e);
        }
    },

    logOut: async (req, res, next) => {
        try {
            const { user: { id } } = req;

            await tokenService.deleteAllTokensForUser(id);

            res
                .status(responseCodes.DELETED)
                .end();
        } catch (e) {
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try {
            await _sendTokens(res, req.user, REWRITE_TOKENS);
        } catch (e) {
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            const { record: user } = req;

            user.isActivated = true;

            await user.save();

            res.redirect(PROFILE);
        } catch (e) {
            next(e);
        }
    },

    confirmReset: async (req, res, next) => {
        try {
            const { user } = req;
            const { resetToken } = tokenService.generateResetTokenForUser(user);

            const resetLink = `${ RESET_PASSWORD_FORM }?resetToken=${ resetToken }`;
            await mailService.sendMessage(user.email, RESET_PASSWORD, { name: user.fullName, resetLink })

            res.status(responseCodes.OK).end();
        } catch (e) {
            next(e);
        }
    },

    changePassword: async (req, res, next) => {
        try {
            const { body: { newPassword }, resetToken } = req;

            const user = await User.findOne({ resetToken });

            if (!user){
                ErrorHandler.throwResetTokenIsNotExist();
            }

            user.password = await passwordHasher.hash(newPassword);
            user.resetToken = 0;

            await user.save();

            res.status(responseCodes.UPDATED).end();
        } catch (e) {
            next(e);
        }
    },
};

async function _sendTokens(res, user, method) {
    const tokens = await authService[method](user.id);

    res
        .status(responseCodes.OK)
        .json({ ...tokens, user });
}
