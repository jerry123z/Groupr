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

router.get("/", (req, res) => {
    dbGet.getAllSchools().then(schools => {
        res.send(JSON.stringify(schools));
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get("/:id", (req, res) => {
    dbGet.getSchool(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.post("/", (req, res) => {
    const school = {
        name: req.body.name
    };

    dbLogin.verifyAdminRequest(req).then(valid => {
        if(!valid)
        {
            throw "Admin not logged in!";
        }
        return dbCreate.createSchool(school.name);
    }).then((school) => {
        res.send(school);
    }).catch(error => {
        res.status(400).send(error);
    });
});

module.exports = router
