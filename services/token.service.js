const jwt = require('jsonwebtoken');

const { promisify } = require('util');
const { models: { Token } } = require('../database');
const {
    authKeywords:
        {
            ACCESS_TOKEN_LIFE_TIME,
            REFRESH_TOKEN_LIFE_TIME,
            RESET_TOKEN_LIFE_TIME,
            ACCESS,
            REFRESH,
            RESET
        },
    config: {
        ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET,
        RESET_TOKEN_SECRET
    }
} = require('../constants');

const verifyToken = promisify(jwt.verify);

module.exports = {
    generateTokens: () => {
        const accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE_TIME });
        const refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE_TIME });

        return {
            accessToken,
            refreshToken
        };
    },

    verifyToken: async (token, type = ACCESS) => {
        let secret;

        if (type === ACCESS){
            secret = ACCESS_TOKEN_SECRET;
        } else if (type === REFRESH) {
            secret = REFRESH_TOKEN_SECRET;
        } else if (type === RESET) {
            secret = RESET_TOKEN_SECRET
        }

        await verifyToken(token, secret);
    },

    deleteAllTokensForUser: async (userId) => {
        await Token.deleteMany({ user: userId });
    },

    generateResetTokenForUser: (user) => {
        const resetToken = jwt.sign({}, RESET_TOKEN_SECRET, { expiresIn: RESET_TOKEN_LIFE_TIME });

        user.resetToken = resetToken;
        user.save();

        return { resetToken };
    },
};
