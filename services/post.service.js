const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const { query } = require('express');

exports.savePost = async function(postData, userId) 
{
    try 
    {
        let existingPost;
        existingPost = await Post.findById(postData.id);
        if (!existingPost) 
        {
            existingPost = new Post();
        } 

        if(postData.title!== undefined)
        {
            existingPost.title = postData.title;
        }
        if(postData.body!== undefined)
        {
            existingPost.body = postData.body;
        }
        if(postData.longitude!== undefined)
        {
            existingPost.longitude = postData.longitude;
        }
        if(postData.latitude!== undefined)
        {
            existingPost.latitude = postData.latitude;
        }
        if(postData.post!== undefined)
        {
            existingPost.post = postData.post;
        }
        existingPost.createdBy = userId; 
        const savedPost = await existingPost.save();
        return savedPost;
    } 
    catch (e) 
    {
        throw new Error('Error while saving post: ' + e.message);
    }
};

exports.getPosts = async function(userId) 
{
    var populateOptions ={
        path: 'comments',
        select: 'text'
    }
    try 
    {
        const posts = await Post.find({}).populate(populateOptions);
        return posts;
    } 
    catch (e) 
    {
        throw new Error('Error while retrieving posts: ' + e.message);
    }
};

exports.getPostById = async function(postId, userId) 
{
    try 
    {
        const fetchOptions = {
            _id: postId, 
            createdBy: userId
        }
        const post = await Post.findOne(fetchOptions);
        if (!post) 
        {
            throw new Error('Post not found or you are not authorized to view it');
        }
        return post;
    } 
    catch (e) 
    {
        throw new Error('Error while retrieving post by ID: ' + e.message);
    }
};

exports.deletePost = async function(postId, userId) 
{
    try 
    {
        const fetchOptions = {
            _id: postId, 
            createdBy: userId
        }
        const post = await Post.findOne(fetchOptions);
        if (!post) 
        {
            throw new Error('Post not found or you are not authorized to delete it');
        }
        post.isActive = false;
        var savedPost = await post.save();
        return savedPost;
    } 
    catch (e) 
    {
        throw new Error('Error while deleting post: ' + e.message);
    }
};

exports.getPostsByLocation = async function(latitude, longitude) 
{
    try 
    {
        var fetchOptions = {
            latitude:latitude,
            longitude: longitude
        }
        const posts = await Post.find(fetchOptions);

        return posts;
    }
    catch (error) 
    {
        throw new Error('Error retrieving posts by location: ' + error.message);
    }
};

exports.addLike = async function(postId, userId) {
    try 
    {
        if(postId !== undefined)
        {
            const post = await Post.findById(postId);
            if (!post) 
            throw new Error('Post not found');
            if (!post.likes.includes(userId)) 
            {
                post.likes.push(userId);
            }
            const updatedPost = await post.save();
            return updatedPost;

        }       
    }
    catch (e) 
    {
        throw new Error('Error while liking post: ' + e.message);
    }
};

exports.addComment = async function(postId, commentText, userId, commentId= null) 
{
    try 
    {
        if(postId !== undefined)
        {
            const post = await Post.findById(postId);
            if (!post) throw new Error('Post not found');

            var option = {
                user: userId,
                text: commentText,
                comments: []
            }
            const comment = new Comment(option);
            const savedComment = await comment.save();

            if (commentId) 
            {
                const existingComment = await Comment.findById(commentId);
                if (!existingComment)
                {
                    throw new Error('Main comment not found');
                }
                console.log(comment)
                existingComment.comments.push(savedComment._id);
                await existingComment.save();
            } 
            else 
            {
                post.comments.push(savedComment._id);
                await post.save();
            }
    
            const updatedPost = await post.save();
            return updatedPost;
        }
    } 
    catch (e) 
    {
        throw new Error('Error while adding comment: ' + e.message);
    }
};