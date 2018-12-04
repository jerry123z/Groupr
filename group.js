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

// Route for group creation
router.post("/:user_id/:assignment_id", (req, res) => {
    const user_id = req.params.user_id;
    const assignment_id = req.params.assignment_id;

    if(!ObjectID.isValid(user_id)) {
        res.status(400).send("Invalid user id.");
        return;
    } else if(!ObjectID.isValid(assignment_id)) {
        res.status(400).send("Invalid assignment id.");
        return;
    }

    dbGet.getUser(user_id).then(user => {
        dbGet.getAssignment(assignment_id).then(assignment => {
            const group = {
                name: req.body.name,
                description: req.body.description,
                schedule: req.body.schedule,
                school: user.school,
                course: assignment.course,
                assignment: assignment._id,
                maxMembers: assignment.maxMembers,
                owner: user._id
            };
            dbCreate.createGroup(group.name, group.description, group.schedule,
            group.school, group.course, group.assignment, group.maxMembers,
            group.owner).then(group => {
                user.groups.push(group._id);
                assignment.groups.push(group._id);
                user.save();
                assignment.save();
                res.send(group);
            });
        });
    }).catch(error => {
        res.status(400).send(error);
    })
});

router.get("/:id", (req, res) => {
    dbGet.getGroup(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

module.exports = router
