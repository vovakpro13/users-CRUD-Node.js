const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../errors');

class PasswordHasher {
    async compare(password, hashedPassword) {
        const isEqual = await bcrypt.compare(password, hashedPassword);

        if (!isEqual) {
            ErrorHandler.throwWrongAuthError();
        }
    }

    async hash(password) {
        return await bcrypt.hash(password, 10);
    }
}

module.exports = new PasswordHasher();
