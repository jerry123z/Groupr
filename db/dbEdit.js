
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Token, User, School, Course, Assignment, Group } = require('../models.js');
const bcrypt = require('bcryptjs');
const dbGet = require('./dbGet.js');
const dbDelete = require('./dbDelete.js');

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

function editSchool(id, name){
	 return new Promise((resolve, reject)=>{
        if(!(ObjectID.isValid(id)))
        {
            reject("getUser: Invalid id provided: " + id);
        }
        const properties = {
            name: name
        }
        School.findByIdAndUpdate(id, {$set: properties}, {new: true}).then((school) => {
            console.log(school)
            resolve(school);
        }).catch(error => {
            reject("editSchool: " + JSON.stringify(error));
        });
    })
}

function editCourse(id, name, schoolId){
    return new Promise((resolve, reject)=>{
        if(!(ObjectID.isValid(id)))
        {
            reject("editCourse: Invalid id provided: " + id);
        }
        const properties = {
            name:name,
            school:schoolId,
        }

        Course.findByIdAndUpdate(id, {$set: properties}, {new: true}).then((course) => {
            resolve(course);
        }).catch(error => {
            reject("editCourse: " + JSON.stringify(error));
        });
    })
}

function editGroup(id, name, description, schedule, maxMembers){
    return new Promise((resolve, reject)=>{
        if(!(ObjectID.isValid(id)))
        {
            reject("editGroup: Invalid id provided: " + id);
        }
        const properties = {
            name:name,
            description:description,
            schedule:schedule,
            maxMembers:maxMembers
        }

        Group.findByIdAndUpdate(id, {$set: properties}, {new: true}).then((group) => {
            resolve(group);
        }).catch(error => {
            reject("editGroup: " + JSON.stringify(error));
        });
    })
}

//helper function
function assignNewOwner(groupId, ownerId){
    return new Promise((resolve, reject) => {
        if(!(ObjectID.isValid(id)))
        {
            reject("editGroup: Invalid id provided: " + id);
        }
        const properties = {
            owner:ownerId
        }
        Group.findByIdAndUpdate(id, {$set:properties}, {new: true}).then( group =>{
            resolve(group)
        }).catch((error) => {
            reject(error)
        })
    })
}


//Call this right before deleting a user who is the owner
function newGroupOwnerOrDelete(groupId, ownerId){
    return new Promise((resolve, reject) => {
        if(!(ObjectID.isValid(groupId))){
            reject("newGroupOwner: Invalid groupId provided: " + groupId);
        } else if (!(ObjectID.isValid(ownerId))) {
            reject("newGroupOwner: Invalid ownerId provided: " + ownerId);
        }
        Group.findById(groupId).then((group)=>{
            console.log(group)
            if (group.members.length == 1 && group.members[0] == ownerId){
                return dbDelete.deleteGroup(groupId)
            } else {
                for(let i = 0; i < group.memebers; i++){
                    if (group.members[i] != ownerId){
                        return assignNewOwner(groupId, group.memebers[i])
                    }
                }
            }
        }).then((group)=>{
            resolve(group)
        }).catch(error =>{
            reject(error)
        })
    })
}

module.exports = {
    editUser,
	editSchool,
	editCourse,
	editGroup,
    assignNewOwner,
    newGroupOwnerOrDelete
}
