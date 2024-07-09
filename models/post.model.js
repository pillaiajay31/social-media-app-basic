const mongoose = require('mongoose');
var CommentSchema = require('../models/comment.model')
const PostSchema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    latitude: {
         type: Number,
    },
    longitude: {
         type: Number,
    },
    post: {
         type: String 
    },
    likes: [{
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User'
    }],
    comments: [{
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Comment' 
    }]  

});
const post = mongoose.model('Post', PostSchema,'posts');
module.exports = post;
