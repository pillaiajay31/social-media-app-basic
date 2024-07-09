const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, //Using Required true is not good practice as it should be in frontEnd but as here I don't have frontend part so included this
        unique: true
    },
    password: {
        type: String,
        required: true //Using Required true is not good practice as it should be in frontEnd but as here I don't have frontend part so included this.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema,'usersParSolution');
