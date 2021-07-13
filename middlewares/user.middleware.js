const { models: { User } } = require('../database');
const { ErrorHandler } = require('../errors');
const { responseCodes } = require('../constants');
const {
    errorMessages: {
        EMAIL_ALREADY_EXIST
    }
} = require('../errors');

module.exports = {
    checkUniqueEmail: async (req, res, next) => {
        try {
            const { email } = req.body;

            const userWithEmail = await User.findOne({ email });

            if (userWithEmail) {
                throw new ErrorHandler(
                    responseCodes.ALREADY_EXIST,
                    EMAIL_ALREADY_EXIST.message,
                    EMAIL_ALREADY_EXIST.code
                );
            }

            next();
        } catch (err) {
            next(err);
        }
    }
};
