const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');

router.post('/save', PostController.savePost);
router.post('/table', PostController.getPosts);
router.post('/:id', PostController.getPostById);
router.delete('/:id', PostController.deletePost);
router.post('/getByLocation', PostController.getPostsByLocation);
router.post('/likePost', PostController.likePost);
router.post('/comment', PostController.addComment);

module.exports = router;
