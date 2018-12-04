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

const {getArrData, obfuscateUser} = require("./routeUtil.js");

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

router.get("/full/:id", (req, res) => {
    let assignment;
    dbGet.getSchool(req.params.id).then(schoolData => {
        assignment = assignmentData._doc;
        return dbGet.getSchool(assignment.school);
    }).then(school => {
        assignment.school = school;
        return dbGet.getCourse(assignment.course);
    }).then(course => {
        assignment.course = course;
        return getArrData(assignment.groups, dbGet.getGroup);
    }).then(groups => {
        assignment.groups = groups;
        return getArrData(assignment.members, dbGet.getUser);
    }).then(members => {
        assignment.members = members.map(member => obfuscateUser(member));
        res.send(assignment);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error);
    });
});

router.get("/:id", (req, res) => {
    dbGet.getSchool(req.params.id).then(school => {
        res.send(school);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.post("/", (req, res) => {
    const school = {
        name: req.body.name
    };

    dbCreate.createSchool(school.name).then((school) => {
        res.send(school);
    }).catch(error => {
        res.status(400).send(error);
    });
});

module.exports = router
