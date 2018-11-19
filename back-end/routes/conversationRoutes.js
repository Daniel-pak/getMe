var express = require('express');
var conversationRoutes = express.Router();
var Conversation = require('../models/conversation');
var User = require('../models/user')


conversationRoutes.get('/', function (req, res) {
    Conversation.find(function (err, conversation) {
        if (err) return res.status(500).send(err);
        res.send(conversation)
    })
})

conversationRoutes.get('/:id', function (req, res) {
    Conversation.findOne({_id: req.params.id})
        .populate([{
            path: 'messages',
            model: 'Message',
        },{
                path: 'users',
                model: 'User',
                select: 'email firstName lastName _id'
            }
        ])
        .exec(function (err, conversation) {
            if (err) return res.status(500).send(err);
            res.send(conversation)
        })
})

conversationRoutes.post('/', function (req, res) {
    Conversation.findOne({
        _id: req.body._id
    }, function (err, conversation) {
        if (err) return res.status(500).send(err);
        if (!conversation) {
            var newConversation = new Conversation(req.body)
            req.user.conversations.push(newConversation._id)
            newConversation.save(function (err) {
                if (err) return res.status(500).send(err);


                for (var i = 0; i < newConversation.users.length; i++) {

                    User.findOne({
                        _id: newConversation.users[i]
                    }, function (err, user) {

                        if (err) return res.status(500).send(err);

                        user.conversations.push(newConversation._id);

                        user.save(function (err) {
                            if (err) return res.status(500).send(err);


                        })
                    })
                }
                User.findOne({
                    _id: req.user._id
                }).
                populate({
                    path: 'conversations',
                    model: 'Conversation',
                    populate: [{
                        path: 'users',
                        model: 'User',
                        select: 'email firstName lastName'
                    },{
                        path: 'messages',
                        model: 'Message',
                        options: {
                            sort: {
                                createdAt: -1
                            },
                            limit: 1
                        }
                    }]
                }).exec(function (err, user) {
                    if (err) return res.status(500).send(err);
                    res.send({
                        conversation: newConversation,
                        user: user
                    })
                })

            })
        }
        if (conversation) {
            res.send(conversation)
        }
    })
})

conversationRoutes.put('/:id', function (req, res) {
    Conversation.findOneAndUpdate(req.params._id, req.body, {
        new: true
    }, function (err, updatedConversation) {
        if (err) return res.status(500).send(err);
        res.send(updatedConversation)
    })
})

conversationRoutes.delete('/:id', function (req, res) {
    Conversation.findOneAndRemove({
        _id: req.params._id
    }, function (err, conversation) {
        if (err) return res.status(500).send(err);
        res.send({
            message: "success! Delete!"
        })
    })
})


module.exports = conversationRoutes;
