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

const school = require('./school')
const course = require('./course')
const assignment = require('./assignment')
const group = require('./group')
const login = require('./login')
const user = require('./user')

// Start the front end.
app.use('/school', school)
app.use('/course', course)
app.use('/asignment', assignment)
app.use('/group', group)
app.use('/login', login)
app.use('/user', user)

app.use(express.static(__dirname + "/frontend"));

app.get('/', function(req, res){
    res.sendfile('login.html', { root: __dirname + "/frontend" } );
});

app.get('/', function(req, res){
    res.sendfile('login.html', { root: __dirname + "/frontend" } );
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
