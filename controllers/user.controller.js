const { v4: uuidv4 } = require('uuid');

const {
    mailService: { sendMessage },
    tokenService: { deleteAllTokensForUser },
    userService: { addNewAvatar, setMainAvatar }
} = require('../services');
const {
    responseCodes,
    responseMessages,
    emailActions: {
        WELCOME,
        ACCOUNT_DELETED,
        EMAIL_ACTIVATION
    },
    serverEndpoints: { ACTIVATION }
} = require('../constants');
const {
    passwordHasher,
    dataNormalizators: { userNormalize }
} = require('../helpers');
const { models: { User, Avatar } } = require('../database');

module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.find();

            res.status(responseCodes.OK).json(users);
        } catch (err) {
            next(err);
        }
    },

    getUserById: (req, res) => {
        const { record: user } = req;

        res.status(responseCodes.OK).json(user);
    },

    createUser: async (req, res, next) => {
        try {
            const { body: user, avatar } = req;

            const password = await passwordHasher.hash(user.password);
            const activationCode = uuidv4();

            const createdUser = await User.create({ ...user, password, activationCode });

            const { id, firstName, email } = createdUser;

            await sendMessage(email, WELCOME, { name: firstName });
            await sendMessage(email, EMAIL_ACTIVATION, { name: firstName, activationLink: `${ACTIVATION}/${activationCode}` });

            if (avatar) {
                const { avatarId } = await addNewAvatar(id, avatar);

                createdUser.avatars = [avatarId];
                await createdUser.save();
            }

            userNormalize(createdUser);

            res
                .status(responseCodes.CREATED)
                .json({ message: responseMessages.SUCCESS_CREATED, createdUser });
        } catch (err) {
            next(err);
        }
    },

    removeUserById: async (req, res, next) => {
        try {
            const { id } = req.params;

            const { email, firstName } = await User.findByIdAndUpdate(id, { isDeleted: true });

            await sendMessage(email, ACCOUNT_DELETED, { name: firstName });
            await deleteAllTokensForUser(id);

            res.sendStatus(responseCodes.DELETED);
        } catch (err) {
            next(err);
        }
    },

    updateUserById: async (req, res, next) => {
        try {
            const { params: { id }, body } = req;

            const { email } = await User.findByIdAndUpdate(id, body, {
                new: true,
                useFindAndModify: false
            });

            res
                .status(responseCodes.UPDATED)
                .json({ message: responseMessages.SUCCESS_UPDATED });
        } catch (err) {
            next(err);
        }
    },

    addNewAvatars: async (req, res, next) => {
        try {
            const { images, params: { id } } = req;
            const avatarsId = [];

            for (const avatar of images) {
                const { avatarId } = await addNewAvatar(id, avatar);

                avatarsId.push(avatarId);
            }

            await User.findByIdAndUpdate(id, { $push: {  avatars: {$each: [...avatarsId] , $position: 0 } } });

            res
                .status(responseCodes.UPDATED)
                .json({ message: responseMessages.SUCCESS_UPDATED });
        } catch (err) {
            next(err);
        }
    },

    removeAvatarById: async (req, res, next) => {
        try {
            const { params: { id: userId, avatarId } } = req;

            await Avatar.deleteOne({ _id: avatarId });
            await User.updateOne({ _id: userId }, { $pull: { avatars: avatarId } });

            res
                .status(responseCodes.DELETED).end();
        } catch (err) {
            next(err);
        }
    },

    setNewMainAvatar: async (req, res, next) => {
        try {
            const { params: { id: userId, avatarId } } = req;

           await setMainAvatar(userId, avatarId);

            res
                .status(responseCodes.UPDATED).json({ mainAvatar: avatarId });
        } catch (err) {
            next(err);
        }
    },
};
