
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
            reject("getUser: Invalid id provided: " + id);
        }
        const properties = {
            email:email,
            name:name,
            schoolId:schoolId,
            isAdmin:isAdmin
        }

        User.findByIdAndUpdate(id, {$set: properties}).then((user) => {
            resolve(user);
        }).catch(error => {
            reject("getUser: " + JSON.stringify(error));
        });
    })
}

function editSchool(){

}

function editCourse(){

}

function editGroup(){

}

module.exports = {
    editUser
}
