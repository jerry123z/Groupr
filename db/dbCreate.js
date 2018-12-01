
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('models.js');
const bcrypt = require('bcryptjs');

// Connect to mongo database.
mongoose.connect('mongodb://localhost:27017/Groupr', { useNewUrlParser: true});

function createUser(email, password, name, school, isAdmin) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
            if(error) {
                reject(error);
            }
            resolve(salt);
        });
    }).then(salt => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, salt, (error, hash) => {
                if(error) {
                    reject(error);
                }
                resolve({hash, salt});
            });
        });
    }).then(pass => {
        const newUser = new User({ email, passHash: pass.hash, passSalt: pass.salt, name, school, isAdmin });
        return newUser.save();
    });
}

module.exports = {
    createUser
};
