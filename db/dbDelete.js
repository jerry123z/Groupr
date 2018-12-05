const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('../models.js');
const bcrypt = require('bcryptjs');
const dbGet = require('./dbGet.js');

mongoose.connect('mongodb://localhost:27017/Groupr', { useNewUrlParser: true});


function deleteCourseFromSchool(schoolId, courseId){
    return new Promise((resolve, reject) => {
        School.findByIdAndUpdate(schoolId, {$pull:{courses: {_id: courseId}}}).then(school => {
            console.log(school);
            resolve(school);
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

function saveArray( array ){
    return new Promise((resolve, reject) => {
        var count = 0;
        docs.forEach(function(doc){
            doc.save().then((doc) => {
                //do nothing
            }).catch((doc) => {
                reject("Unable to save " + doc)
            })
        })
        resolve("saved successfully");
    })
}

module.exports = {
    deleteGroup
}
