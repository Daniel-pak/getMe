var express = require('express');
var userRoutes = express.Router();
var User = require('../models/user');

userRoutes.get('/:id', function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err) return res.status(500).send(err);
        res.send(user);
    })
})

userRoutes.put('/settings/:id', function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, newUser){
        if (err) return res.status(500).send(err);
        return res.send(newUser);
    });
});



userRoutes.put('/:email', function (req, res) {
    User.findOne({email: req.params.email}).select("email").exec(function (err, user) {
        if (err) return res.status(500).send(err);
        res.send(user)
    });
});

userRoutes.put('/:id', function (req, res) {
    User.findOneAndUpdate().select("email").exec(function (err, user) {
        if (err) return res.status(500).send(err);
        res.send(user)
    });
});

// userRoutes.get('/:id', function(req, res){
//     User.findOne(req.params._id).
//     populate({
//         path: 'conversations',
//         model: 'Conversation',
//         populate: [{
//             path: 'users',
//             model: 'User',
//             select: 'email firstName lastName'
//         },
//             {
//                 path: 'messages',
//                 model: 'Message',
//                 options: {
//                     sort: {
//                         createdAt: -1
//                     },
//                     limit: 1
//                 }
//             }]
//     }).exec(function(err, user){
//         if(err) return res.status(500).send(err);
//         res.send(user)
//     })
// })



userRoutes.post('/contact', function (req, res) {
    const userKeys = Object.keys(User.schema.obj);
    userKeys.splice(1, 2);
    userKeys.splice(2, 2);

    var profile = req.body.profile;

    profile = profile.slice(profile.indexOf('&') + 1).split("");

    var select = "firstName ";

    const buildSelect = function (qrCode, schemaItem, select) {
        for (var i = 0; i < qrCode.length; i++) {
            if (qrCode[i] === "1") select += `${schemaItem[i]} `;
        }
        return select;
    }

    select = buildSelect(profile, userKeys, select);

    User.findOne({_id: req.body._id}).select(select).exec(function (err, user) {
        if (err) return res.status(500).send(err);
        res.send(user)
    })

})

// userRoutes.post('/', function(req, res){
//     var newUser = new User(req.body)
//
//     newUser.save(function(err){
//         if(err) return res.status(500).send(err);
//         res.send(newUser)
//     })
// })

userRoutes.put('/contact/:id', function (req, res) {
    User.findOne({_id: req.params.id}, function (err, user) {

        console.log(user.contacts)
        console.log(user.contacts[0])

        var match = false
        var updatedUser = user;

        for (var i = 0; i < updatedUser.contacts.length; i++) {
            if(updatedUser.contacts[i].user == req.body.user) {
                updatedUser.contacts[i] = req.body;
                match = true;
            }
        }
        if(!match) {
            updatedUser.contacts.push(req.body)
        }

        updatedUser.save(function(err, user){
            if (err) return res.status(500).send(err);
            res.status(200).send(user);
        })



    });
})



userRoutes.delete('/:id', function (req, res) {
    User.findOneAndRemove({_id: req.params._id}, function (err, user) {
        if (err) return res.status(500).send(err);
        res.send({message: "success! Delete!"})
    })
})

module.exports = userRoutes;
