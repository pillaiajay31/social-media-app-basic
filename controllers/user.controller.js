const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const UserService = require('../services/user.service.js');
const secret = 'your_jwt_secret_key'; 

exports.registerUser = async (req, res) => {

    var userId = req.body.id;
    var username = req.body.username;
    var password = req.body.password; 

    if(!userId)
    {
        userId = "";
    }
    var resStatus = 0;
    var resMsg = "";
    var httpStatus = 201;
    var responseObj = {};
    if(username && username !== undefined && password && password !== undefined )
    {
        try 
        {
            var existingUser = await User.findOne({ username });
            if(existingUser)
            {
                return res.status(400).json({ msg: 'User already exists' });                
            }
            let user = await UserService.registerUser(username, password);
            
            const payload = { id: user.id };
            const token = jwt.sign(payload, secret, { expiresIn: 3600 });
            res.json({ token });
        } 
        catch (err) 
        {
            console.error('Error registering user:', err.message);
            res.status(500).send('Server error');
        }
    }
};

exports.loginUser = async (req, res) => {
    var username = req.body.username;
    var password  = req.body.password;

    if (!username && username !== undefined) 
    {
        return res.status(400).json({ msg: 'Invalid or missing username' });
    }
    if (!password && password !== undefined) 
    {
        return res.status(400).json({ msg: 'Invalid or missing password' });
    }
    try 
    {
        const user = await User.findOne({ username });
        if (!user) 
        {
            console.log("HELOOOOOOOO"+user)
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await UserService.comparePassword(password, user.password);
        console.log("HELLLLLLLLLOoooooo"+isMatch)
        if (!isMatch) 
        {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { id: user.id };
        const token = jwt.sign(payload, secret, { expiresIn: 3600 });
        res.json({ token });
    } 
    catch (err) 
    {
        console.error('Error logging in user:', err.message);
        res.status(500).send('Server error');
    }
};

exports.getUsers = async function(req, res) 
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
        const users = await UserService.getUsers(userId);
        res.status(200).json({ status: 200, data: users, message: 'Users retrieved successfully' });
    } 
    catch (e) 
    {
        res.status(500).json({ status: 500, message: `Error retrieving users: ${e.message}` });
    }
};

exports.getUserById = async function(req, res) {
    const token = req.headers.authorization && req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }
    console.log("Hello")

    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: `Authentication error: ${error.message}` });
        }
    });

    const userId = req.body.id;

    try {
        const user = await UserService.getUserById(userId);
        res.status(200).json({ status: 200, data: user, message: 'User retrieved successfully' });
    } catch (e) {
        res.status(500).json({ status: 500, message: `Error retrieving user: ${e.message}` });
    }
};

exports.deleteUser = async function(req, res) 
{
    const token = req.headers.authorization && req.headers.authorization;
    if (!token) 
    {
        return res.status(401).json({ message: "Token not found" });
    }
    console.log("Hello")
    jwt.verify(token, secret, (error, decoded) => {
        if (error) 
        {
            return res.status(401).json({ message: `Authentication error: ${error.message}` });
        } 
    });

    const userId = req.params.id;

    try 
    {
        const user = await UserService.deleteUser(userId);
        res.status(200).json({ status: 200, data: user, message: 'User deleted successfully' });
    }
    catch (e) 
    {
        res.status(500).json({ status: 500, message: `Error deleting user: ${e.message}` });
    }
};



exports.updateUser = async function(req, res, next) {
    try {
        const userId = req.body.id;
        const username = req.body.username;
        const password = req.body.password;

        const updatedUser = await UserService.updateUser(userId, username,password);

        res.status(200).json({
            status: "success",
            data: updatedUser
        });
    }
    catch (e) 
    {
        res.status(400).json({
            status: "error",
            message: e.message
        });
    }
};

