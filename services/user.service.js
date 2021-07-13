const AWS = require('aws-sdk');

const { buildFileDir } = require('./file.service');
const { models: { Avatar, User } } = require('../database');
const {
    config: {
        AWS_ID,
        AWS_SECRET_ACCESS_KEY,
        AWS_BUCKET_NAME,
        AWS_AVATAR_ACL
    }
} = require('../constants');

const bucket = new AWS.S3({
    accessKeyId: AWS_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

module.exports = {
    addNewAvatar: async (userId, avatarFile) => {
        const { uploadUrl } = await buildFileDir(avatarFile.name, userId);

        await bucket.putObject({
            Bucket: AWS_BUCKET_NAME,
            Key: uploadUrl,
            Body: avatarFile.data,
            ACL: AWS_AVATAR_ACL
        }).promise();

        const { id: avatarId } = await Avatar.create({
            user: userId,
            imageUrl: uploadUrl
        });

        return { avatarId };
    },

    setMainAvatar: async (userId, avatarId) => {
        await User.findByIdAndUpdate(userId,
            {$pull: { avatars: avatarId }},
            { useFindAndModify: true });

        await User.findByIdAndUpdate(userId,
            { $push: {  avatars: { $each: [avatarId] , $position: 0 } } },
            { useFindAndModify: true });
    }
};
