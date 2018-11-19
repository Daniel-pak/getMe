var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    message: String,
}, {timestamps: true});

messageSchema.pre('remove', function (next) {
  this.model('Conversation').update(
    {_id: {$in: this.conversations}},
    {$pull: {messages: this._id}},
    {multi: true},
    next
  );
});

module.exports = mongoose.model('Message', messageSchema)
