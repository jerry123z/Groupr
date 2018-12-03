
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('../models.js');

// Connect to mongo database.
mongoose.connect('mongodb://localhost:27017/Groupr', { useNewUrlParser: true});

function getUser(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getUser: Invalid id provided: " + id);
        }
        User.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getUser: " + JSON.stringify(error));
        });
    });
}

function getSchool(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getSchool: Invalid id provided: " + id);
        }
        School.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getSchool: " + JSON.stringify(error));
        });
    });
}

function getCourse(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getCourse: Invalid id provided: " + id);
        }
        Course.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getCourse: " + JSON.stringify(error));
        });
    });
}

function getAssignment(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getAssignment: Invalid id provided: " + id);
        }
        Assignment.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getAssignment: " + JSON.stringify(error));
        });
    });
}

function getGroup(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getGroup: Invalid id provided: " + id);
        }
        Group.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getGroup: " + JSON.stringify(error));
        });
    });
}

function getAllSchools() {
    return School.find();
}

module.exports = {
    getUser,
    getSchool,
    getCourse,
    getAssignment,
    getGroup,
    getAllSchools
};
