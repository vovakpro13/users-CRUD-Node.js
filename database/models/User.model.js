const { Types, Schema, model } = require('mongoose');

const { dbTablesEnum: { USER, AVATAR } } = require('../../constants');

const requiredString =  {
    type: String,
    required: true
};

const userSchema = new Schema(
    {
        firstName: requiredString,
        lastName: requiredString,
        address: String,
        email: requiredString,
        password: {
            ...requiredString,
            select: false
        },
        avatars: [{
            type: Types.ObjectId,
            ref: AVATAR
        }],
        activationCode: {
            ...requiredString,
            select: false
        },
        resetToken: {
            type: String,
            select: false
        },
        isActivated:{
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false,
            select: false
        }
    },
        {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
})

userSchema.pre('find', _preFindHook,)
userSchema.pre('findOne', _preFindHook)

function _preFindHook() {
    this.where({ isDeleted: false });
    this.populate('avatars');
}

module.exports = model(USER, userSchema);