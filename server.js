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

// Start the database.
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Start the front end.
app.use(express.static(__dirname + "/frontend"));

app.get("/user/:id", (req, res) => {
    dbGet.getUser(req.params.id).then(user => {
        res.send(user);
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
    dbGet.getSchool(user.school).then(school => {
        return dbCreate.createUser(user.email, user.password, user.name, user.school, user.isAdmin);
    }, error => {
        res.status(400).send("Invalid school id.");
        return;
    }).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send("Failed to create user.");
    });
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
