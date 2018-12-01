'use strict';

const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

// Connect to mongo database.
mongoose.connect('mongodb://localhost:27017/Groupr', { useNewUrlParser: true});

// Import the models.
const { User, School, Course, Assignment, Group } = require('./models.js');

// Start the database.
const app = express();
app.use(bodyParser.json());

// Start the front end.
app.use(express.static(__dirname + "/frontend"));

app.listen(port, () => {
    console.log("Listening on port " + port);
});
