
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('../models.js');
const bcrypt = require('bcryptjs');
const dbGet = require('./dbGet.js');

// Connect to mongo database.
mongoose.connect('mongodb://localhost:27017/Groupr', { useNewUrlParser: true});

function editUser(id, email, name, schoolId, isAdmin){
    return new Promise((resolve, reject)=>{
        if(!(ObjectID.isValid(id)))
        {
            reject("editUser: Invalid id provided: " + id);
        }
        const properties = {
            email:email,
            name:name,
            schoolId:schoolId,
            isAdmin:isAdmin
        }

        User.findByIdAndUpdate(id, {$set: properties}, {new: true}).then((user) => {
            resolve(user);
        }).catch(error => {
            reject("editUser: " + JSON.stringify(error));
        });
    })
}

function editSchool(){

}

function editCourse(id, name, schoolId){
    return new Promise((resolve, reject)=>{
        if(!(ObjectID.isValid(id)))
        {
            reject("editCourse: Invalid id provided: " + id);
        }
        const properties = {
            name:name,
            schoolId:schoolId,
        }

        School.findByIdAndUpdate(id, {$set: properties}, {new: true}).then((school) => {
            resolve(school);
        }).catch(error => {
            reject("editSchool: " + JSON.stringify(error));
        });
    })
}

function editGroup(id, name, description, maxMembers){
    return new Promise((resolve, reject)=>{
        if(!(ObjectID.isValid(id)))
        {
            reject("editGroup: Invalid id provided: " + id);
        }
        const properties = {
            name:name,
            description:description
            maxMembers:maxMembers
        }

        Group.findByIdAndUpdate(id, {$set: properties}, {new: true}).then((group) => {
            resolve(group);
        }).catch(error => {
            reject("editGroup: " + JSON.stringify(error));
        });
    })
}

module.exports = {
    editUser
}
