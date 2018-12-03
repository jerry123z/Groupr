'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import the models.
const { Token, User, School, Course, Assignment, Group } = require('./models.js');
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


router.post("/", (req, res) => {
    let user = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        school: req.body.school,
        isAdmin: false
    };

    if(!ObjectID.isValid(user.school)) {
        res.status(400).send("Invalid school id.");
        return;
    }

    dbCreate.createUser(user.email, user.password, user.name, user.school, user.isAdmin).then(userRet => {
        user = userRet;
        return bcrypt.genSalt();
    }).then(token => {
        return new Token({tokenHash: token, user: user._id}).save();
    }).then(token => {
        res.cookie("auth", {token: token.tokenHash, user: token.user});
        res.send(obfuscateUser(user));
    }).catch(error => {
        res.status(400).send("Failed to create user: " + JSON.stringify(error));
    });
});

router.get("/:id", (req, res) => {
    dbGet.getUser(req.params.id).then(user => {
        res.send(obfuscateUser(user));
    }).catch(error => {
        res.status(400).send(error);
    });
});

module.exports = router
