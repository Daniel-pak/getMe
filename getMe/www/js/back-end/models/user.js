var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')

var userSchema = new Schema({
    socialsignin: {
      type: Boolean,
      required: false,
      default: false
    },
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
    },
    lastName: String,
    conversations: [{
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    }],
    contacts: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
      },
      profileAccess: String,
      nickName: String
    }],
    linkedIn: String,
    facebook: String,
    twitter: String,
    instagram: String,
    snapchat: String,
    phone: String,
    phone_2: String,
    website_1: String,
    website_2: String,
    github: String,
    tumblr: String,
    pinterest: String,
    kik: String,
    periscope: String,
    medium: String,
    reddit: String,
    skype: String,
    twitch: String,
    vine: String,
    vimeo: String,
    wordpress: String,
    email_2: String,
    homeAddress: String,
    businessAddress: String,
    workAddress: String,
    birthDate: Date,
  // google: String,
  // shots: String,
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

module.exports = mongoose.model('User', userSchema)
