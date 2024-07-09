const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    text: { 
        type: String,
        required: true 
    },
    createdAt: {
         type: Date, 
         default: Date.now 
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }] 
});

const Comment = mongoose.model('Comment', CommentSchema, 'comments');
module.exports = Comment;
