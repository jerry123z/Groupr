const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('../models.js');
const bcrypt = require('bcryptjs');
const dbGet = require('./dbGet.js');

mongoose.connect('mongodb://localhost:27017/Groupr', { useNewUrlParser: true});


function deleteCourseFromSchool(schoolId, courseId){

	return new Promise((resolve, reject) => {
		School.findByIdAndUpdate(schoolId, {$pull:{courses: courseId}}).then(school => {
			resolve(school);
		}).catch(error => {
			reject("removeCourse: " + JSON.stringify(error));
		});
	})		
}

function deleteCourse(courseId){
	console.log(courseId);
	return new Promise((resolve, reject) => {
		Course.findByIdAndRemove(courseId).then(course => {
			console.log(course);
			resolve(course);
		}).catch(error => {
			reject("removeCourse: " + JSON.stringify(error));
		});
	})
}




module.exports = {
    deleteCourseFromSchool,
	deleteGroup,
	deleteGroupp,
	deleteCourse
};
