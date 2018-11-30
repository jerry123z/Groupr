
const mongoose = require('mongoose');

const User = mongoose.model("User", {
    email: {
        type: String,
        required: true,
        unique: true
    },
    passHash: {
        type: String,
        required: true,
        unique: true
    },
    passSalt: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    school: {
        type: ObjectId,
        required: true
    },
    courses: [[ObjectId]],
    groups: [[ObjectId]],
    isAdmin: {
        type: boolean,
        required: true
    }
});

module.exports = {
    User
};
