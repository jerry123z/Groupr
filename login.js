'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import the models.
const { Token, User, School, Course, Assignment, Group, Notification} = require('./models.js');
const dbGet = require('./db/dbGet.js');
const dbCreate = require('./db/dbCreate.js');
const dbLogin = require('./db/dbLogin.js');

const router = express.Router();
router.use(bodyParser.json());
router.use(cookieParser());

// Start the front end.
router.use(express.static(__dirname + "/frontend"));


function obfuscateUser(user) {
    const userObj = {
        _id: user._id,
        name: user.name,
        school: user.school,
        courses: user.courses,
        assignments: user.assignments,
        groups: user.groups
    };
    return userObj;
}


router.get("/", (req, res) => {
    dbLogin.verifyRequest(req).then(userId => {
        if(userId) {
            return dbGet.getUser(userId);
        } else {
            throw "Bad token";
        }
    }).then(user => {
        res.send(obfuscateUser(user));
    }).catch(error => {
        res.status(400).send("Invalid authentication: " + error);
    });
});

router.post("/", (req, res) => {
    const login = {
        email: req.body.email,
        password: req.body.password
    };
    dbLogin.authenticate(login.email, login.password).then(token => {
        res.cookie("auth", {token: token.tokenHash, user: token.user});
        return dbGet.getUser(token.user);
    }).then(user => {
        res.send(obfuscateUser(user));
    }).catch(error => {
        res.status(400).send("Failed to log in: " + error);
    });
});

router.delete("/", (req, res) => {
    dbLogin.clearToken(req, res).then(() => {
        res.send("Logged out.");
    }).catch(error => {
        res.status(400).send(error);
    })
});

module.exports = router
