var express = require('express');
var authRoutes =  express.Router();
var User = require('../models/user');
var config = require('../config');
var jwt = require('jsonwebtoken');
var Message = require('../models/message');
var Conversation = require('../models/conversation')

authRoutes.post('/signup', function(req, res){
    console.log("Inside the signup route");
    User.find({email: req.body.email}, function(err, user) {
        console.log("Inside the callback after reaching out to the database")
        if(err) return res.status(500).send(err);
        if(user.length) return res.send({success: false, message: 'this user already exists in the database'})

        var newUser = new User(req.body);

        newUser.save(function(err){
            if(err) return res.status(500).send(err);
            res.send({success: true, user: newUser, message: 'Successfully creates a new User'})
        })
    })
})

authRoutes.post('/login', function(req, res){
    User.findOne({email: req.body.email})
        .populate({
            path: 'conversations',
            model: 'Conversation',
            populate: [{
                path: 'users',
                model: 'User',
                select: 'email firstName lastName'
            }, {
                path: 'messages',
                model: 'Message',
                options: {
                    sort: {createdAt: -1},
                    limit: 1
                }
            }]
        }).populate({path: 'contacts.user', model: 'User', select: 'firstName'}).exec(function(err, user){
        if(err) return res.status(500).send(err);
        if(!user) return res.status(401).send({success: false, message: "Invalid email or password"});

        user.checkPassword(req.body.password, function(err, isMatch){
            if(err) return res.status(403).send(err);
            if(!isMatch) return res.status(401).send({success: false, message: "Invlaid email or password"});

            var token = jwt.sign(user.toObject(), config.secret, {expiresIn: "24h"});

            res.send({token: token, success: true, user: user.withoutPassword(), message: "Successfully received token"})
        })
    })
})

authRoutes.post('/social-login', function(req, res) {
    User.find({email: req.body.email}, function (err, user) {
        console.log("Inside the callback after reaching out to the database")
        if (err) return res.status(500).send(err);
        if(!user.length) {
            var newUser = new User(req.body);

            newUser.save(function (err) {
                if (err) return res.status(500).send(err);
               console.log('user created')
                User.findOne({email: req.body.email})
                    .populate({
                        path: 'conversations',
                        model: 'Conversation',
                        populate: [{
                            path: 'users',
                            model: 'User',
                            select: 'email firstName lastName'
                        }, {
                            path: 'messages',
                            model: 'Message',
                            options: {
                                sort: {createdAt: -1},
                                limit: 1
                            }
                        }]
                    }).populate({path: 'contacts.user', model: 'User', select: 'firstName'}).exec(function(err, user){
                    if(err) return res.status(500).send(err);
                    if(!user) return res.status(401).send({success: false, message: "Invalid email or password"});

                    user.checkPassword(req.body.password, function(err, isMatch){
                        if(err) return res.status(403).send(err);
                        if(!isMatch) return res.status(401).send({success: false, message: "Invlaid email or password"});

                        var token = jwt.sign(user.toObject(), config.secret, {expiresIn: "24h"});

                        res.send({token: token, success: true, user: user.withoutPassword(), message: "Successfully received token"})
                    })
                })

            })
        }

        if(user.length) {
            User.findOne({email: req.body.email})
                .populate({
                    path: 'conversations',
                    model: 'Conversation',
                    populate: [{
                        path: 'users',
                        model: 'User',
                        select: 'email firstName lastName'
                    }, {
                        path: 'messages',
                        model: 'Message',
                        options: {
                            sort: {createdAt: -1},
                            limit: 1
                        }
                    }]
                }).populate({path: 'contacts.user', model: 'User', select: 'firstName'}).exec(function(err, user){
                if(err) return res.status(500).send(err);
                if(!user) return res.status(401).send({success: false, message: "Invalid email or password"});

                user.checkPassword(req.body.password, function(err, isMatch){
                    if(err) return res.status(403).send(err);
                    if(!isMatch) return res.status(401).send({success: false, message: "Invlaid email or password"});

                    var token = jwt.sign(user.toObject(), config.secret, {expiresIn: "24h"});

                    res.send({token: token, success: true, user: user.withoutPassword(), message: "Successfully received token"})
                })
            })
        }

    })
})

module.exports = authRoutes;
