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

const {getArrData, obfuscateUser} = require("./routeUtil.js");

const router = express.Router();
router.use(bodyParser.json());
router.use(cookieParser());

// Start the front end.
router.use(express.static(__dirname + "/frontend"));

// Route for assignment creation
router.post("/:school_id/:course_id", (req, res) => {
    const school_id = req.params.school_id;
    const course_id = req.params.course_id;

    const assignment = {
        name: req.body.name,
        school: school_id,
        course: course_id,
        maxMembers: req.body.maxMembers
    };

    if(!ObjectID.isValid(assignment.school)) {
        res.status(400).send("Invalid school id.");
        return;
    } else if(!ObjectID.isValid(assignment.course)) {
        res.status(400).send("Invalid course id.");
        return;
    }

    dbLogin.verifyAdminRequest(req).then(valid => {
        if(!valid) {
            throw "Admin not logged in!";
        }
        return dbCreate.createAssignment(assignment.name, assignment.school,
            assignment.course, assignment.maxMembers)
    })
    .then(assignment => {
        dbGet.getCourse(assignment.course).then(course => {
            course.assignments.push(assignment._id);
            course.save();
        });
        res.send(assignment);
    }).catch (error => {
        res.status(400).send(error);
    });
});

router.get("/full/:id", (req, res) => {
    let assignment;
    dbGet.getAssignment(req.params.id).then(assignmentData => {
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
        res.send(assignment);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error);
    });
});

router.get("/:id", (req, res) => {
    dbGet.getAssignment(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

module.exports = router
