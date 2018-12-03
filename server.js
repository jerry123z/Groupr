'use strict';

const express = require('express');
const port = process.env.PORT || 3000;
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

// Start the database.
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Start the front end.
app.use(express.static(__dirname + "/frontend"));

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

app.get("/user/:id", (req, res) => {
    dbGet.getUser(req.params.id).then(user => {
        res.send(obfuscateUser(user));
    }).catch(error => {
        res.status(400).send(error);
    });
});

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

app.get("/full/user/:id", (req, res) => {
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

app.get("/school", (req, res) => {
    dbGet.getAllSchools().then(schools => {
        res.send(JSON.stringify(schools));
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.get("/school/:id", (req, res) => {
    dbGet.getSchool(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.get("/course/:id", (req, res) => {
    dbGet.getCourse(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.get("/assignment/:id", (req, res) => {
    dbGet.getAssignment(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.get("/group/:id", (req, res) => {
    dbGet.getGroup(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

// Route for course creation
app.post("/course/:school_id", (req, res) => {
    const school_id = req.params.school_id;

    const course = {
        name: req.body.name,
        school: school_id
    };

    if(!ObjectID.isValid(course.school)) {
        res.status(400).send("Invalid school id.");
        return;
    }

    dbCreate.createCourse(course.name, course.school).then(course => {
        res.send(course);
    }).catch(error => {
        res.status(400).send(error);
    });
});

// Route for assignment creation
app.post("/assignment/:school_id/:course_id", (req, res) => {
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

    dbCreate.createAssignment(assignment.name, assignment.school,
    assignment.course, assignment.maxMembers).then(assignment => {
        res.send(assignment);
    }).catch (error => {
        res.status(400).send(error);
    });
});

// Route for group creation
app.post("/group/:user_id/:assignment_id", (req, res) => {
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
                res.send(group);
            });
        });
    }).catch(error => {
        res.status(400).send(error);
    })
});

app.post("/user", (req, res) => {
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

app.post("/school", (req, res) => {
    const school = {
        name: req.body.name
    };

    dbCreate.createSchool(school.name).then((school) => {
        res.send(school);
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.get("/login", (req, res) => {
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

app.post("/login", (req, res) => {
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

app.delete("/login", (req, res) => {
    dbLogin.clearToken(req, res).then(() => {
        res.send("Logged out.");
    }).catch(error => {
        res.status(400).send(error);
    })
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
