'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

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

// Route for course creation
router.post("/:school_id", (req, res) => {
    const school_id = req.params.school_id;

    const course = {
        name: req.body.name,
        school: school_id
    };

    if(!ObjectID.isValid(course.school)) {
        res.status(400).send("Invalid school id.");
        return;
    }

    dbLogin.verifyAdminRequest(req).then(valid => {
        if(!valid) {
            throw "Admin not logged in!";
        }
        return dbCreate.createCourse(course.name, course.school);
    }).then(course => {
        dbGet.getSchool(course.school).then(school => {
            school.courses.push(course._id);
            school.save();
        })
        res.send(course);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get("/full/:id", (req, res) => {
    let course;
    dbGet.getCourse(req.params.id).then(courseData => {
        course = courseData._doc;
        return dbGet.getSchool(course.school);
    }).then(school => {
        course.school = school;
        return getArrData(course.assignments, dbGet.getAssignment);
    }).then(assignments => {
        course.assignments = assignments;
        return getArrData(course.members, dbGet.getUser);
    }).then(members => {
        course.members = members.map(member => obfuscateUser(member));
        res.send(course);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error);
    });
});

router.get("/:id", (req, res) => {
    dbGet.getCourse(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

// Route for getting all courses
router.get("/", (req, res) => {
    dbGet.getAllCourses().then(courses => {
        res.send(courses)
    }).catch(error => {
        res.status(400).send(error);
    })
});

//TODO NOT DONE
//deleting
router.delete("/:id", (req, res) =>{
    const id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(400).send("Invalid course id.");
        return;
    }
})


router.get("/name/:name", (req, res) => {
	console.log(req.params.name);
	dbGet.getCourseByPartialName(req.params.name).then((courses) => {
		res.send(courses);
	}).catch((error) => {
		res.status(400).send(error);
	});
});

module.exports = router
