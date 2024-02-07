const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);

module.exports = User;