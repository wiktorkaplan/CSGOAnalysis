const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordChangedAt: Date,
    matches: {
        type: Array,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    //only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    //hash the password with cos of 12
    this.password = await bcrypt.hash(this.password, 12)
    //delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changeTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 10
        );
        console.log(this.passwordChangedAt, JWTTimestamp);
        return JWTTimestamp < changeTimestamp; //100<200
    }
    //FALSE MEANS NOT CHANGED
    return false;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
