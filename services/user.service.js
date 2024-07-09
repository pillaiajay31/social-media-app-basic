const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');

exports.hashPassword = async (password) => {
    if(password !== undefined && password !== "")
    {
        const salt = await bcrypt.genSalt(10);
        var hashedPassword = bcrypt.hash(password, salt);
        return hashedPassword
    }
};

exports.comparePassword = async (password, hashedPassword) => {
    if(password !== undefined && password !== "" && hashedPassword !== undefined && hashedPassword !== "")
    {
        var passwordCompare = bcrypt.compare(password, hashedPassword);
        console.log(passwordCompare)
        return passwordCompare
    }
};

exports.registerUser = async (username, password) => {

    if (!username && username !== undefined) 
    {
        throw new Error('Invalid or missing username');
    }
    if (!password && password !== undefined) 
    {
        throw new Error('Invalid or missing password');
    }

    try 
    {
        const hashedPassword = await exports.hashPassword(password);
        const user = new User({ username, password: hashedPassword });
        var savedUser = await user.save();
        return savedUser;
    } 
    catch (err)
    {
        throw new Error('Error registering user: ' + err.message);
    }

};

exports.getUsers = async function() 
{
    try 
    {
        const users = await User.find({})
        return users;
    } 
    catch (e) 
    {
        throw new Error('Error while retrieving users: ' + e.message);
    }
};

exports.getUserById = async function(userId) 
{
    try 
    {
        const fetchOptions = {
            _id: userId, 
        }
        const user = await User.findOne(fetchOptions);
        if (!user) 
        {
            throw new Error('User not found or you are not authorized to view it');
        }
        return user;
    } 
    catch (e) 
    {
        throw new Error('Error while retrieving user by ID: ' + e.message);
    }
};

exports.deleteUser = async function(userId) {
    try 
    {
        const user = await User.findById(userId);

    
        if (!user) 
        {
            throw new Error('User not found');
        }

        var deletedUser =  await User.findByIdAndDelete(userId);

        return deletedUser;
    } 
    catch (e) 
    {
        throw new Error('Error while deleting user: ' + e.message);
    }
};
exports.updateUser = async function(userId, username,password) {
    try 
    {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) 
        {
            throw new Error('User not found');
        }

        return updatedUser;
    } 
    catch (e) 
    {
        throw new Error('Error while updating user: ' + e.message);
    }
};