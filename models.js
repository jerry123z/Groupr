
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

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
    assignments: [[ObjectId]],
    groups: [[ObjectId]],
    isAdmin: {
        type: Boolean,
        required: true
    }
});

const School = mongoose.model("School", {
    name: {
        type: String,
        required: true
    },
    members: [[ObjectId]],
    courses: [[ObjectId]]
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
    members: [[ObjectId]],
    assignments: [[ObjectId]]
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
    members: [[ObjectId]],
    groups: [[ObjectId]]
});

const Group = mongoose.model("Group", {
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
    members: [[ObjectId]],
    requests: [{
        isUser: Boolean,
        id: ObjectId
    }]
});

module.exports = {
    User,
    School,
    Course,
    Assignment,
    Group
};
