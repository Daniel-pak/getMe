var express = require('express');
var messageRoutes = express.Router(); 
var Message = require('../models/message');
var Conversation = require('../models/conversation')


messageRoutes.get('/', function(req, res){
    Message.find(function(err, message){
        if(err) return res.status(500).send(err);
        res.send(message)
    })
})

messageRoutes.get('/:id', function(req, res){
    Message.findOne(req.params._id)
        .exec(function(err, message){
        if(err) return res.status(500).send(err);
        res.send(message)
    })
})


messageRoutes.post('/', function(req, res){
    var newMessage = new Message(req.body)
    
    newMessage.save(function(err){
        if(err) return res.status(500).send(err);
        Conversation.findOne({_id: req.body.conversation}, function(err, conversation){
            if (err) return res.status(500).send(err);

            
            conversation.messages.push(newMessage._id);
            
            conversation.save(function(err){
                if(err) return res.status(500).send(err);
                res.send({message: newMessage, conversation: conversation.id, success: true})
            })
        })
        
    })
})

messageRoutes.put('/:id', function(req, res){

    Message.findOneAndUpdate(req.params._id, req.body, {new: true}, function(err, updatedMessage){
        if(err) return res.status(500).send(err);
        res.send(updatedMessage)
    })
})

messageRoutes.delete('/:id', function(req, res){
    Message.findOneAndRemove({_id: req.params._id},function(err, message){
        if(err) return res.status(500).send(err);
        res.send({message: "success! Delete!"})
    })
})


module.exports = messageRoutes;