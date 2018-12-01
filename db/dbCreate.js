
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('../models.js');
const bcrypt = require('bcryptjs');

// Connect to mongo database.
mongoose.connect('mongodb://localhost:27017/Groupr', { useNewUrlParser: true});

function createUser(email, password, name, school, isAdmin) {
    return bcrypt.genSalt(10).then(salt => {
        return bcrypt.hash(password, salt);
    }).then(hash => {
        const newUser = new User({ email, passHash: hash, name, school, isAdmin });
        return newUser.save();
    });
}

function createSchool(name) {
    return new School({name}).save();
}

module.exports = {
    createUser,
    createSchool
};
