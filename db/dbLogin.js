
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Token, User } = require('../models.js');

// Connect to mongo database.
mongoose.connect('mongodb://localhost:27017/Groupr', { useNewUrlParser: true});

function authenticate(email, password) {
    let user;
    return User.findOne({email}).then(userRet => {
        user = userRet;
        return bcrypt.compare(password, user.passHash);
    }, error => {
        throw "Find user: " + error;
    }).then(isValid => {
        if(!isValid)
        {
            throw "bcrypt compare: Invalid password";
        }
        // Generate a salt as the token.
        return bcrypt.genSalt();
    }, error => {
        throw "bcrypt compare: " + error;
    }).then(token => {
        return new Token({tokenHash: token, user: user._id}).save();
    });
}

function verify(tokenHash, user) {
    return new Promise((resolve, reject) => {
        Token.findOne({tokenHash, user}).then(token => {
            resolve(true);
        }).catch(error => {
            resolve(false);
        });
    });
}

function clearToken(tokenHash, user) {
    return new Promise((resolve, reject) => {
        Token.deleteOne({tokenHash, user}).then(() => {
            resolve(true);
        }).catch(error => {
            resolve(false);
        });
    });
}

function clearUserTokens(user) {
    return new Promise((resolve, reject) => {
        Token.deleteMany({user}).then(() => {
            resolve(true);
        }).catch(error => {
            resolve(false);
        });
    });
}

module.exports = {
    authenticate,
    verify,
    clearToken,
    clearUserTokens
};
