const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const signature = process.env.SIGNATURE || require('../secrets').SIGNATURE;

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64)
                        .toString('hex');
}
userSchema.methods.validPassword = function(passwrod){
    const hash = crypto.pbkdf2Sync(passwrod, this.salt, 1000, 64)
                        .toString('hex');
    return this.hash === hash;
}
userSchema.methods.generateJwt = function(){
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 7);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiration.getTime() / 1000)
    }, signature);
}

var User = mongoose.model('User', userSchema);
module.exports = User;