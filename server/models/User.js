const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 3
    },
    role: {
        type: String,
        required: true
    },
    dates: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('users', userSchema);