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

// Route for getting a notification for a user
router.get("/:user_id", (req, res) => {

});

// Route for adding a notification
router.post("/", (req, res) => {
    const notification = {
        user: req.body.email,
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

module.exports = routerff
