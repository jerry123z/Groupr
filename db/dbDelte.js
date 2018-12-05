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
function getUsers(id){
    console.log("@@");
    dbGet.getUser(user).then(user => {
        console.log(user)
        return user
    }).catch()
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
            return saveAssignment = Assignment.findByIdAndUpdate(assignment._id, {$pull:{group:saveGroup._id}})
        }).then((assignment) => {
            saveUsers = saveGroup.members.map(user => getUsers(user))
            console.log(saveUsers)
            changedUsers = saveUsers.map( user => user.groups.id(saveGroup._id).remove())

            return saveArray(changedUsers)
        }).then((string) => {
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
