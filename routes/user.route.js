const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.controller');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/table', authController.getUsers);
router.post('/detail', authController.getUserById);
router.delete('/:id', authController.deleteUser);



module.exports = router;
