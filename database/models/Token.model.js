const { Types, Schema, model } = require('mongoose');

const { dbTablesEnum } = require('../../constants');

const tokenSchema = new Schema({
    user: {
        type: Types.ObjectId,
        required: true,
        ref: dbTablesEnum.USER
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

tokenSchema.pre('find', populateUser);
tokenSchema.pre('findOne', populateUser);

module.exports = model(dbTablesEnum.TOKEN, tokenSchema);

function populateUser() {
    this.populate('user');
}
