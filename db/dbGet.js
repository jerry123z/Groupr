
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('models.js');

// Connect to mongo database.
mongoose.connect('mongodb://localhost:27017/Groupr', { useNewUrlParser: true});

function isTokenValid(tokenHash, user) {
    return new Promise((resolve, reject) => {
        Token.find({tokenHash}, (token) => {
            if(token.user == user) {
                resolve(true);
            } else {
                reject(false);
            }
        }).catch(error => {
            reject(false);
        });
    });
}

function getUser(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("Invalid id provided.");
        }
        User.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject(error);
        });
    });
}

function getSchool(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("Invalid id provided.");
        }
        School.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject(error);
        });
    });
}

function getCourse(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("Invalid id provided.");
        }
        Course.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject(error);
        });
    });
}

function getAssignment(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("Invalid id provided.");
        }
        Assignment.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject(error);
        });
    });
}

function getGroup(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("Invalid id provided.");
        }
        Group.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject(error);
        });
    });
}

function getGroup(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("Invalid id provided.");
        }
        Group.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject(error);
        });
    });
}

module.exports = {
    isTokenValid,
    getUser,
    getSchool,
    getCourse,
    getAssignment,
    getGroup
};
