'use strict';

const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

// Import the models.
const { User, School, Course, Assignment, Group } = require('./models.js');
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

app.post("/user", (req, res) => {
    const user = {
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

    dbCreate.createUser(user.email, user.password, user.name, user.school, user.isAdmin).then(user => {
        res.send(obfuscateUser(user));
    }).catch(error => {
        res.status(400).send("Failed to create user: " + JSON.stringify(error));
    });
});

app.post("/school", (req, res) => {
    const school = {
        name: req.body.name,
        user: req.body.user
    };

    if(!ObjectID.isValid(school.user)){
        res.status(400).send("Invalid user id.");
        return;
    }

    dbCreate.createSchool(school.name, school.user).then((school) => {
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
