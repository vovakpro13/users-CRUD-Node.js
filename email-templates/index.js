const {
    emailActions: {
        WELCOME,
        ACCOUNT_DELETED,
        EMAIL_ACTIVATION,
        RESET_PASSWORD
    }
} = require('../constants');

module.exports = {
    [WELCOME]: {
        template: 'welcome',
        subject: 'Welcome on my website!'
    },
    [ACCOUNT_DELETED]: {
        template: 'deleted',
        subject: 'Your account was deleted!'
    },
    [EMAIL_ACTIVATION]: {
        template: 'activation',
        subject: 'Email activation'
    },
    [RESET_PASSWORD]: {
        template: 'reset',
        subject: 'Confirm reset password'
    }
};
