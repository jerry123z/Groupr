
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('../models.js');

// Connect to mongo database.
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Groupr'
mongoose.connect(mongoURI, { useNewUrlParser: true});

function getUser(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getUser: Invalid id provided: " + id);
        }
        User.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getUser: " + JSON.stringify(error));
        });
    });
}

function getUserByPartialEmail(email) {
	var val = new RegExp(".*"+email+".*");
	return new Promise((resolve, reject) => {
		User.find({email : val}).then(users => {
			resolve(users);
		}).catch(error => {
			reject("getUser: " + JSON.stringify(error));
		});
	});
}

function getSchool(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getSchool: Invalid id provided: " + id);
        }
        School.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getSchool: " + JSON.stringify(error));
        });
    });
}

function getSchoolByPartialName(name){
	var val = new RegExp(".*"+name+".*");
	return new Promise((resolve, reject) => {
        School.find({name: val}).then(schools => {
            resolve(schools);
        }).catch(error => {
            reject("getSchool: " + JSON.stringify(error));
        });
    });
}

function getCourse(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getCourse: Invalid id provided: " + id);
        }
        Course.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getCourse: " + JSON.stringify(error));
        });
    });
}

function getCourseByPartialName(name){
	var val = new RegExp(".*"+name+".*");
	return new Promise((resolve, reject) => {
		Course.find({name: val}).then(courses => {
			resolve(courses);
		}).catch(error => {
			reject("getCourse: " + JSON.stringify(error));
		});
    });
}


function getAssignment(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getAssignment: Invalid id provided: " + id);
        }
        Assignment.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getAssignment: " + JSON.stringify(error));
        });
    });
}

function getGroup(id) {
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(id))
        {
            reject("getGroup: Invalid id provided: " + id);
        }
        Group.findById(id).then(user => {
            resolve(user);
        }).catch(error => {
            reject("getGroup: " + JSON.stringify(error));
        });
    });
}

function getGroupsForAssignment(aId) {
    debugger;
    return new Promise((resolve, reject) => {
        if(!ObjectID.isValid(aId))
        {
            reject("getGroupForAssignment: Invalid id provided: " + aId);
        }
        getAllGroups().then(groups => {
            let groupsForAssignment = groups.filter(group => {
                return group.assignment.toString() === aId.toString();
            });
            resolve(groupsForAssignment);
        }).catch(error => {
            reject("getGroupsForAssignment: " + JSON.stringify(error));
        });
    });
}

function getGroupByPartialName(name){
	var val = new RegExp(".*"+name+".*");
	return new Promise((resolve, reject) => {
		Group.find({name: val}).then(courses => {
			resolve(courses);
		}).catch(error => {
			reject("getGroup: " + JSON.stringify(error));
		});
    });
}

function getAllGroups() {
    return Group.find();
}

function getAllSchools() {
    return School.find();
}

function getAllCourses() {
    return Course.find();
}

module.exports = {
    getUser,
	getUserByPartialEmail,
    getSchool,
	getSchoolByPartialName,
    getCourse,
	getCourseByPartialName,
    getAssignment,
    getGroup,
    getGroupsForAssignment,
	getGroupByPartialName,
    getAllSchools,
    getAllGroups,
    getAllCourses
};
