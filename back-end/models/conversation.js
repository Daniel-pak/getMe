var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }],
}, {timestamps: true})

conversationSchema.pre('remove', function (next) {
    this.model('User').update(
        {_id: {$in: this.users}},
        {$pull: {conversations: this._id}},
        {multi: true},
        next
    );
});

conversationSchema.pre('remove', function (next) {
    this.model('Message').update(
        {_id: {$in: this.messages}},
        {$pull: {conversations: this._id}},
        {multi: true},
        next
    );
});

module.exports = mongoose.model('Conversation', conversationSchema)