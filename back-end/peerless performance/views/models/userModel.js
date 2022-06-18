const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;