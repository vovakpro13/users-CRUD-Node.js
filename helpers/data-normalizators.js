module.exports = {
    userNormalize: (userObject = {}) => {
        const secretKeys = ['password', 'activationCode'];

        for (const key of secretKeys) {
            userObject[key] = undefined;
        }
    }
};
