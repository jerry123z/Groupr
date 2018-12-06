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
const dbEdit = require('./db/dbEdit.js');

const {getArrData, obfuscateUser} = require("./routeUtil.js");

const router = express.Router();
router.use(bodyParser.json());
router.use(cookieParser());

// Start the front end.
router.use(express.static(__dirname + "/frontend"));

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
        if(user.school) {
            return dbGet.getSchool(user.school).then(school => {
                user.school = school;
                return getArrData(user.courses, dbGet.getCourse);
            });
        } else {
            return getArrData(user.courses, dbGet.getCourse);
        }
    }).then(courses => {
        user.courses = courses.slice();
        return getArrData(courses, (course) => {
            return getArrData(course.assignments, dbGet.getAssignment).then(assignment => {
                return Promise.resolve(assignment);
            });
        });
    }).then(assignments => {
        user.assignments = assignments[0];
        return getArrData(user.groups, dbGet.getGroup);
    }).then(groups => {
        return getArrData(groups, (group) => {
            return getArrData(group.members, dbGet.getUser).then(members => {
                group._doc.members = members.map(el => obfuscateUser(el));
                return Promise.resolve(group._doc);
            });
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
            // Only add the course if it is not already being taken by user
            if (checkCourseAgainstUser(user, course)) {
                course.members.push(user._id);
                user.courses.push(course._id);
                course.save();
                user.save();
                res.send(user);
            } else {
                res.status(400).send("User is already taking course.")
                return;
            }
        }).catch(error => {
            res.status(404).send(error);
        });
    }).catch(error => {
        res.status(404).send(error);
    });
});

// Returns true iff user is not currently taking the course, false if the user
// is taking the course.
function checkCourseAgainstUser(user, course) {
    return user.courses.every((userCourseId) => {
        return userCourseId.toString() != course._id.toString();
    });
}

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

    let userLogin;
    let user;
    dbLogin.verifyRequest(req).then(loggedInUser => {
        if(!loggedInUser) {
            throw "Owner not logged in!";
        }
        userLogin = loggedInUser;
        return dbGet.getUser(user_id);
    }).then(userGet => {
        user = userGet;
        return dbGet.getGroup(group_id);
    }).then(group => {
        if(group.owner != userLogin) {
            throw "Owner not logged in!";
        }
        group.members.push(user._id);
        user.groups.push(group._id);
        group.save();
        user.save();
        res.send(user);
    }).catch(error => {
        res.status(404).send(error);
    });
});

//route for changing a user's name
router.patch("/name/:id", (req, res) => {
    const id = req.params.id
    const name = req.body.name

    dbGet.getUser(req.params.id).then(user => {
        return dbEdit.editUser(user._id, user.email, name, user.schoolId, user.isAdmin)
    }).then(user => {
        res.send(user)
    }).catch(error => {
        res.status(400).send(error);
    });
})

//route for changing a user's email
router.patch("/email/:id", (req, res) => {
    const id = req.params.id
    const email = req.body.email

    dbGet.getUser(req.params.id).then(user => {
        return dbEdit.editUser(user._id, email, user.name, user.schoolId, user.isAdmin)
    }).then(user => {
        res.send(user)
    }).catch(error => {
        res.status(400).send(error);
    });
})

//route for a user's school
//requires the schoolId in the body
router.patch("/school/:id", (req, res) => {
    const id = req.params.id
    const schoolId = req.body.schoolId

    dbGet.getUser(req.params.id).then(user => {
        return dbEdit.editUser(user._id, user.email, user.name, schoolId, user.isAdmin)
    }).then(user => {
        res.send(user)
    }).catch(error => {
        res.status(400).send(error);
    });
})

//route for changing a user's admin status
router.patch("/admin/:id", (req, res) => {
    const id = req.params.id
    const isAdmin = req.body.isAdmin

    dbGet.getUser(req.params.id).then(user => {
        return dbEdit.editUser(user._id, user.email, user.name, user.schoolId, isAdmin)
    }).then(user => {
        res.send(user)
    }).catch(error => {
        res.status(400).send(error);
    });
})



router.get("/email/:email", (req, res) => {
	dbGet.getUserByPartialEmail(req.params.email).then((users) => {
		res.send(users);
	}).catch((error) => {
		res.status(400).send(error);
	});
});

module.exports = router
