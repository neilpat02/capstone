const mongoose = require('mongoose'); //interface with MongoDB

//userschema that is defined for every user. 
const userSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    softwareScore: {
        type: Number,
        default: 10
    },
    hardwareScore: {
        type: Number,
        default: 0
    }
    
});

//each document will be a user with properties as declared in our schema
const User = mongoose.model('User', userSchema);

module.exports = User;