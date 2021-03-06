
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Token = mongoose.model("Token", {
    tokenHash: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: ObjectId,
        required: true
    }
});

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
    name: {
        type: String,
        required: true
    },
    school: {
        type: ObjectId
    },
    courses: [ObjectId],
    assignments: [ObjectId],
    groups: [ObjectId],
    isAdmin: {
        type: Boolean,
        required: true
    }
});

const School = mongoose.model("School", {
    name: {
        type: String,
        required: true,
        unique: true
    },
    members: [ObjectId],
    courses: [ObjectId]
});

const Course = mongoose.model("Course", {
    name: {
        type: String,
        required: true
    },
    school: {
        type: ObjectId,
        required: true
    },
    members: [ObjectId],
    assignments: [ObjectId]
});

const Assignment = mongoose.model("Assignment", {
    name: {
        type: String,
        required: true
    },
    school: {
        type: ObjectId,
        required: true
    },
    course: {
        type: ObjectId,
        required: true
    },
    maxMembers: {
        type: Number,
        required: true
    },
    members: [ObjectId],
    groups: [ObjectId]
});

const Group = mongoose.model("Group", {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    schedule: {
        0: [[String]],
        1: [[String]],
        2: [[String]],
        3: [[String]],
        4: [[String]],
        5: [[String]],
        6: [[String]]
    },
    school: {
        type: ObjectId,
        required: true
    },
    course: {
        type: ObjectId,
        required: true
    },
    assignment: {
        type: ObjectId,
        required: true
    },
    maxMembers: {
        type: Number,
        required: true
    },
    owner: {
        type: ObjectId,
        required: true
    },
    members: [ObjectId],
    requests: [{
        isUser: Boolean,
        id: ObjectId
    }]
});

module.exports = {
    Token,
    User,
    School,
    Course,
    Assignment,
    Group
};
