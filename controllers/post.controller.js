const PostService = require('../services/post.service');
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret_key'; 


exports.savePost = async function(req, res) 
{
    console.log("Hello")
    const token = req.headers.authorization && req.headers.authorization
    if (!token) 
    {
        return res.status(401).json({ message: "Token not found" });
    }

    let userId;
    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: `Authentication error: ${error.message}` });
        } else {
            userId = decoded.id;
        }
    });

    const id = req.body.id;
    const title = req.body.title;
    const body= req.body.body;
    const latitude  = req.body.latitude;
    const longitude  = req.body.longitude;
    const isActive = req.body.isActive !== undefined ? req.body.isActive : true;
    const post = req.body.post

    
    if (!title && title == undefined && title == null && !body && body == undefined && body == null && !post && post == undefined && post == null ) 
    {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try 
    {
        const postData = { 
            title:title, 
            body:body,
            latitude: latitude, 
            longitude: longitude,
            isActive: isActive,
            post:post,
        };

        if (id) 
        {
            postData.id = id 
        }
        const savedPost = await PostService.savePost(postData, userId);
        res.status(201).json({ status: 201, data: savedPost, message: 'Post saved successfully' });
    } 
    catch (e) 
    {
        res.status(500).json({ status: 500, message: `Error saving post: ${e.message}` });
    }
};

exports.getPosts = async function(req, res) 
{
    const token = req.headers.authorization && req.headers.authorization;
    if (!token) 
    {
        return res.status(401).json({ message: "Token not found" });
    }
    console.log("Hello")

    let userId;
    jwt.verify(token, secret, (error, decoded) => {
        if (error) 
        {
            return res.status(401).json({ message: `Authentication error: ${error.message}` });
        } 
        else 
        {
            userId = decoded.id;
        }
    });

    try 
    {
        const posts = await PostService.getPosts(userId);
        res.status(200).json({ status: 200, data: posts, message: 'Posts retrieved successfully' });
    } 
    catch (e) 
    {
        res.status(500).json({ status: 500, message: `Error retrieving posts: ${e.message}` });
    }
};

exports.getPostById = async function(req, res) {
    const token = req.headers.authorization && req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }
    console.log("Hello")

    let userId;
    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: `Authentication error: ${error.message}` });
        } else {
            userId = decoded.id;
        }
    });

    const postId = req.params.id;

    try {
        const post = await PostService.getPostById(postId, userId);
        res.status(200).json({ status: 200, data: post, message: 'Post retrieved successfully' });
    } catch (e) {
        res.status(500).json({ status: 500, message: `Error retrieving post: ${e.message}` });
    }
};

exports.deletePost = async function(req, res) 
{
    const token = req.headers.authorization && req.headers.authorization;
    if (!token) 
    {
        return res.status(401).json({ message: "Token not found" });
    }
    console.log("Hello")

    let userId;
    jwt.verify(token, secret, (error, decoded) => {
        if (error) 
        {
            return res.status(401).json({ message: `Authentication error: ${error.message}` });
        } 
        else 
        {
            userId = decoded.id;
        }
    });

    const postId = req.params.id;

    try 
    {
        const post = await PostService.deletePost(postId, userId);
        res.status(200).json({ status: 200, data: post, message: 'Post deleted successfully' });
    }
    catch (e) 
    {
        res.status(500).json({ status: 500, message: `Error deleting post: ${e.message}` });
    }
};

exports.getPostsByLocation = async function(req, res) 
{
    try 
    {
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        if (!latitude && !longitude && longitude == undefined && longitude == null && latitude == undefined && latitude == null) 
        {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        const posts = await PostService.getPostsByLocation(lat, lon);

        res.status(200).json({ status: 200, data: posts, message: 'Posts retrieved successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ status: 500, message: `Error retrieving posts: ${error.message}` });
    }
};

exports.likePost = async function(req, res) {
    const token = req.headers.authorization;
    if (!token) 
    {
        return res.status(401).json({ message: "Token not found" });
    }

    let userId;
    jwt.verify(token, secret, (error, decoded) => {
        if (error) 
        {
            return res.status(401).json({ message: `Authentication error: ${error.message}` });
        } 
        else 
        {
            userId = decoded.id;
        }
    });

    const postId = req.body.id;

    try 
    {
        const updatedPost = await PostService.addLike(postId, userId);
        res.status(200).json({ status: 200, data: updatedPost, message: 'Post liked successfully' });
    }
    catch (e) 
    {
        res.status(500).json({ status: 500, message: `Error liking post: ${e.message}` });
    }
};

exports.addComment = async function(req, res) 
{
    const token = req.headers.authorization;
    if (!token) 
    {
        return res.status(401).json({ message: "Token not found" });
    }

    let userId;
    jwt.verify(token, secret, (error, decoded) => {
        if (error) 
        {
            return res.status(401).json({ message: `Authentication error: ${error.message}` });
        } 
        else
        {
            userId = decoded.id;
        }
    });

    const commentId= req.body.id;
    const comment= req.body.comment;
    const postId = req.body.postId;

    if (!comment && comment == undefined && comment == null) 
    {
        return res.status(400).json({ message: "Comment text is required" });
    }

    try 
    {
        console.log(comment)
        const updatedPost = await PostService.addComment(postId, comment, userId,commentId);
        res.status(200).json({ status: 200, data: updatedPost, message: 'Comment added successfully' });
    }
    catch (e) 
    {
        res.status(500).json({ status: 500, message: `Error adding comment: ${e.message}` });
    }
};