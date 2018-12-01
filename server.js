'use strict';

const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

// Import the models.
const { User, School, Course, Assignment, Group } = require('./models.js');
const dbGet = require('./dbGet.js');

// Start the database.
const app = express();
app.use(bodyParser.json());

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

app.listen(port, () => {
    console.log("Listening on port " + port);
});
