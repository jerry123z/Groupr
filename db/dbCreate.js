
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('../models.js');
const bcrypt = require('bcryptjs');
const dbGet = require('./dbGet.js');

// Connect to mongo database.
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Groupr'
mongoose.connect(mongoURI, { useNewUrlParser: true});

function createUser(email, password, name, schoolId, isAdmin) {
    // We start with looking up the school to ensure it is valid.
    // We don't actually need the object, so we just use a parameterless function.
    let promise = schoolId ? dbGet.getSchool(schoolId).then(() => {
        return bcrypt.genSalt(10);
    }) : bcrypt.genSalt(10);
    return promise.then(salt => {
        return bcrypt.hash(password, salt);
    }).then(hash => {
        const newUser = new User({ email, passHash: hash, name, school: schoolId, isAdmin });
        return newUser.save();
    });
}

function createSchool(name) {
    return new School({name}).save();
}

function createCourse(name, school) {
    return new Course({name, school}).save();
}

function createAssignment(name, school, course, maxMembers) {
    return new Assignment({name, school, course, maxMembers}).save();
}

function createGroup(name, description, schedule, school, course, assignment, maxMembers, owner) {
    return new Group({
        name, description, schedule, school, course, assignment, maxMembers, owner,
        members: [owner],
        requests: []
    }).save();
}

module.exports = {
    createUser,
    createSchool,
    createCourse,
    createAssignment,
    createGroup
};
