var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var encrypt = require('mongoose-encryption');
var config = require('../config')
var phrase = config.encryptSecret

var secret = phrase




var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: String,
    conversations: [{
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    }],
    contacts: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        profileAccess: String,
        nickName: String
    }],
    linkedIn: String,
    kik: String,
    facebook: String,
    twitter: String,
    instagram: String,
    snapchat: String,
    phone: String,
    website: String,
    github: String
});

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    })
});

userSchema.methods.checkPassword = function (passwordAttempt, callback) {
    bcrypt.compare(passwordAttempt, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
}

userSchema.methods.withoutPassword = function () {
    var user = this.toObject();
    delete user.password;
    return user;
}

userSchema.pre('remove', function (next) {
    this.model('Conversation').update(
        {_id: {$in: this.conversations}},
        {$pull: {users: this._id}},
        {multi: true},
        next
    );
});

userSchema.pre('remove', function (next) {
    this.model('Message').update(
        {_id: {$in: this.messages}},
        {$pull: {users: this._id}},
        {multi: true},
        next
    );
});

userSchema.plugin(encrypt, { secret: secret });


module.exports = mongoose.model('User', userSchema)
