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

function getArrData(arr, itemFunction) {
    let promise;
    if(arr.length == 0) {
        promise = new Promise(resolve => { resolve(arr); });
    }
    else
    {
        for(let i = 0; i < arr.length; i++) {
            if(i == 0) {
                promise = itemFunction(arr[0]);
                continue;
            }
            promise.then(data => {
                arr[i - 1] = data;
                return itemFunction(arr[i]);
            });
        }
        if(!promise) {
            console.log(arr);
        }
        promise.then(data => {
            arr[arr.length - 1] = data;
            return new Promise(resolve => { resolve(arr); });
        });
    }
    return promise;
}


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
        dbGet.getSchool(user.school).then(school => {
            school.members.push(token.user);
            school.save();
        }).catch(error => {
            res.status(404).send(error);
        });
    }).catch(error => {
        res.status(400).send("Failed to create user: " + JSON.stringify(error));
    });
});

router.get("/full/:id", (req, res) => {
    let user;
    dbGet.getUser(req.params.id).then(userData => {
        user = userData._doc;
        return dbGet.getSchool(user.school);
    }).then(school => {
        user.school = school;
        return getArrData(user.courses, dbGet.getCourse);
    }).then(courses => {
        user.courses = courses;
        return getArrData(user.assignments, dbGet.getAssignment);
    }).then(assignments => {
        user.assignments = assignments;
        return getArrData(user.groups, dbGet.getGroup);
    }).then(groups => {
        return getArrData(groups, (group) => {
            return getArrData(group.members, dbGet.getUser);
        });
    }).then(groups => {
        user.groups = groups;
        res.send(obfuscateUser(user));
    }).catch(error => {
        console.log(error);
        res.status(400).send(error);
    });
});

router.get("/:id", (req, res) => {
    dbGet.getUser(req.params.id).then(user => {
        res.send(obfuscateUser(user));
    }).catch(error => {
        res.status(400).send(error);
    });
});

// Route for adding an assignment to a user
router.patch("/assignment/:user_id/:assignment_id", (req, res) => {
    const user_id = req.params.user_id;
    const assignment_id = req.params.assignment_id;

    if(!ObjectID.isValid(user_id)) {
        res.status(400).send("Invalid user id.");
        return;
    } else if (!ObjectID.isValid(assignment_id)) {
        res.status(400).send("Invalid assignment id.");
        return;
    }

    dbGet.getUser(user_id).then(user => {
        dbGet.getAssignment(assignment_id).then(assignment => {
            assignment.members.push(user._id);
            user.assignments.push(assignment._id);
            assignment.save();
            user.save();
            res.send(user);
        }).catch(error => {
            res.status(404).send("No such assignment");
        });
    }).catch(error => {
        res.status(404).send("No such user.");
    });
});

// Route for adding a course to a user
router.patch("/course/:user_id/:course_id", (req, res) => {
    const user_id = req.params.user_id;
    const course_id = req.params.course_id;

    if(!ObjectID.isValid(user_id)) {
        res.status(400).send("Invalid user id.");
        return;
    } else if (!ObjectID.isValid(course_id)) {
        res.status(400).send("Invalid course id.");
        return;
    }

    dbGet.getUser(user_id).then(user => {
        dbGet.getCourse(course_id).then(course => {
            course.members.push(user._id);
            user.courses.push(course._id);
            course.save();
            user.save();
            res.send(user);
        }).catch(error => {
            res.status(404).send(error);
        });
    }).catch(error => {
        res.status(404).send(error);
    });
});

// Route for adding a user to a group
router.patch("/group/:user_id/:group_id", (req, res) => {
    const user_id = req.params.user_id;
    const group_id = req.params.group_id;

    if(!ObjectID.isValid(user_id)) {
        res.status(400).send("Invalid user id.");
        return;
    } else if (!ObjectID.isValid(group_id)) {
        res.status(400).send("Invalid group id.");
        return;
    }

    dbGet.getUser(user_id).then(user => {
        dbGet.getGroup(group_id).then(group => {
            group.members.push(user._id);
            user.groups.push(group._id);
            group.save();
            user.save();
            res.send(user);
        }).catch(error => {
            res.status(404).send(error);
        });
    }).catch(error => {
        res.status(404).send(error);
    });
});

module.exports = router
