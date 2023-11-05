const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true},
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;