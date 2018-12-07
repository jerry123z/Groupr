
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

function adminAuthenticate(email, password) {
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
        if (user.isAdmin == false){
            throw "user is not an admin"
        }
        // Generate a salt as the token.
        return bcrypt.genSalt();
    }, error => {
        throw "bcrypt compare: " + error;
    }).then(token => {
        return new Token({tokenHash: token, user: user._id}).save();
    });
}

function verifyRequest(req) {
    if(!req.cookies.auth
        || !req.cookies.auth.token
        || !ObjectID.isValid(req.cookies.auth.user))
    {
        return new Promise((resolve, reject) => {
            reject("Invalid authentication token.");
        });
    }
    return verify().then(valid => {
        return new Promise((resolve, reject) => { resolve(valid ? req.cookies.auth.user : null); });
    });
}

function verifyAdminRequest(req) {
    if(!req.cookies.auth
        || !req.cookies.auth.token
        || !ObjectID.isValid(req.cookies.auth.user))
    {
        return new Promise((resolve, reject) => {
            reject("Invalid authentication token.");
        });
    }
    return verify().then(valid => {
        if(!valid)
        {
            return Promise.resolve(null);
        }
        return new Promise((resolve, reject) => {
            User.findById(req.cookies.auth.user).then(user => {
                resolve(user.isAdmin ? req.cookies.auth.user : null);
            }).catch(error => {
                resolve(null);
            });
        });
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

function clearToken(req, res) {
    if(!req.cookies.auth
        || !req.cookies.auth.token
        || !ObjectID.isValid(req.cookies.auth.user))
    {
        return new Promise((resolve, reject) => {
            reject("Invalid authentication token.");
        });
    }
    return new Promise((resolve, reject) => {
        Token.deleteOne({tokenHash: req.cookies.auth.token, user: req.cookies.auth.user}).then(() => {
            res.cookie("auth", {}, {maxAge: 0});
            resolve(true);
        }).catch(error => {
            reject(error);
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
    adminAuthenticate,
    verifyRequest,
    verify,
    verifyAdminRequest,
    clearToken,
    clearUserTokens
};
