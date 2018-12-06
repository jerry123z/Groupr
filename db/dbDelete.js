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

function deleteGroup(groupId){
    let saveGroup;
    let saveAssignment;
    let saveUsers;
    return new Promise((resolve, reject) => {
        Group.findById(groupId).then(group => {
            saveGroup = group
            return Assignment.findById(saveGroup.assignment)
        }).then((assignment) => {
            saveAssignment = assignment

        }).then((assignment) => {
            return promise =  User.find({
                '_id': { $in:saveGroup.members}
            }).exec()
        }).then((users) => {
            saveUsers = users
            return User.updateMany({'_id': { $in:saveGroup.members}}, {$pull:{groups:groupId}})
        }).then((user) => {
            return Assignment.findByIdAndUpdate(saveAssignment._id, {$pull:{groups:groupId}})
        }).then((assignment) => {
            Group.findByIdAndRemove(groupId).then((group)=>{
                resolve(group)
            })
        }).catch(error => {
            reject("deleteCourse: " + JSON.stringify(error));
        });
    })
}

function deleteMemberFromGroup(groupId, userId){
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(userId, {$pull:{groups:groupId}},  {new: true}).then(user => {
            console.log(user)
            return Group.findByIdAndUpdate(groupId, {$pull:{members:userId}},  {new: true})
        }).then(group => {
            console.log(group)
            resolve(group)
        }).catch(error => {
            reject("deleteMemberFromGroup " + JSON.stringify(error))
        })
    })
}

function deleteUser(userId){
    return new Promise((resolve, reject) => {
        User.findByIdAndRemove(userId).then(user =>{
            resolve(user)
        }).catch((error)=>{
            reject(error)
        })
    })
}

module.exports = {
    deleteCourseFromSchool,
    deleteCourse,
    deleteGroup,
    deleteMemberFromGroup,
    deleteUser
}
