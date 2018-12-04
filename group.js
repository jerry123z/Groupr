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

// Route for group creation
router.post("/:assignment_id", (req, res) => {
    const assignment_id = req.params.assignment_id;

    if(!ObjectID.isValid(assignment_id)) {
        res.status(400).send("Invalid assignment id.");
        return;
    }

    let user;
    let assignment;
    dbLogin.verifyRequest(req).then(user_id => {
        if(!user_id) {
            throw "User not logged in!";
        }
        return dbGet.getUser(user_id);
    }).then(userGet => {
        user = userGet;
        return dbGet.getAssignment(assignment_id);
    }).then(assignmentGet => {
        assignment = assignmentGet;
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
        return dbCreate.createGroup(group.name, group.description, group.schedule,
        group.school, group.course, group.assignment, group.maxMembers,
        group.owner);
    }).then(group => {
        user.groups.push(group._id);
        assignment.groups.push(group._id);
        user.save();
        assignment.save();
        res.send(group);
    }).catch(error => {
        res.status(400).send(error);
    })
});

// Create merge request.
router.post("/merge/:mergeRequestor/:mergeTarget", (req, res) => {
    let userId;
    let requestor;
    let target;
    dbLogin.verifyRequest(req).then(user => {
        if(!user) {
            throw "Owner not logged in!";
        }
        userId = user;
        return dbGet.getGroup(req.params.mergeRequestor);
    }).then(group => {
        requestor = group;
        if(group.owner != userId) {
            throw "Owner not logged in!";
        }
        return dbGet.getGroup(req.params.mergeTarget);
    }).then(group => {
        target = group;
        if(target._doc.requests.find(el => el == requestor._id)) {
            throw "This group has already requested to join target group!";
        }
        target._doc.requests.push(requestor._id);
        return target.save();
    }).then(() => {
        res.send("Request sent!");
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.delete("/merge/:mergeRequestor/:mergeTarget", (req, res) => {
    let userId;
    let requestor;
    let target;
    dbLogin.verifyRequest(req).then(user => {
        if(!user) {
            throw "Owner not logged in!";
        }
        userId = user;
        return dbGet.getGroup(req.params.mergeRequestor);
    }).then(group => {
        requestor = group;
        return dbGet.getGroup(req.params.mergeTarget);
    }).then(group => {
        target = group;
        if(target.owner != userId && requestor.owner != userId) {
            throw "Owner not logged in!";
        }
        target._doc.requests = target._doc.requests.filter(el => el != requestor._id);
        return target.save();
    }).then(() => {
        res.send("Request deleted!");
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.put("/merge/:mergeRequestor/:mergeTarget", (req, res) => {
    let userId;
    let requestor;
    let target;
    dbLogin.verifyRequest(req).then(user => {
        if(!user) {
            throw "Owner not logged in!";
        }
        userId = user;
        return dbGet.getGroup(req.params.mergeTarget);
    }).then(group => {
        target = group;
        if(target.owner != userId) {
            throw "Owner not logged in!";
        }
        return dbGet.getGroup(req.params.mergeRequestor);
    }).then(group => {
        requestor = group;
        // TODO: Do merge.
    });
});

router.get("/full/:id", (req, res) => {
    let group;
    dbGet.getGroup(req.params.id).then(groupData => {
        group = groupData._doc;
        return dbGet.getSchool(group.school);
    }).then(school => {
        group.school = school;
        return dbGet.getCourse(group.course);
    }).then(course => {
        group.course = course;
        return dbGet.getAssignment(group.assignment);
    }).then(assignment => {
        group.assignment = assignment;
        return getArrData(group.members, dbGet.getUser);
    }).then(members => {
        group.members = members.map(member => obfuscateUser(member));
        res.send(group);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error);
    });
});

router.get("/:id", (req, res) => {
    dbGet.getGroup(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get("/name/:name", (req, res) => {
	dbGet.getGroupByPartialName(req.params.name).then(groups =>{
		res.send(groups);
	}).catch((error) => {
		res.status(400).send(error);
	});
});

module.exports = router
