const { Types, Schema, model } = require('mongoose');

const { dbTablesEnum: { USER, AVATAR } } = require('../../constants');

const avatarSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: USER,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model(AVATAR, avatarSchema);
