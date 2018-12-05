'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import the models.
const { Token, User, School, Course, Assignment, Group } = require('./models.js');
const dbGet = require('./db/dbGet.js');
const dbCreate = require('./db/dbCreate.js');
const dbLogin = require('./db/dbLogin.js');

const {getArrData, obfuscateUser, forEach} = require("./routeUtil.js");

const router = express.Router();
router.use(bodyParser.json());
router.use(cookieParser());

// Start the front end.
router.use(express.static(__dirname + "/frontend"));

// Route for group creation
router.post("/:assignment_id", (req, res) => {
    const assignment_id = req.params.assignment_id;

    if(!ObjectID.isValid(assignment_id)) {
        res.status(400).send("Invalid assignment id.");
        return;
    }

    let user;
    let assignment;
    dbLogin.verifyRequest(req).then(user_id => {
        if(!user_id) {
            throw "User not logged in!";
        }
        return dbGet.getUser(user_id);
    }).then(userGet => {
        user = userGet;
        return dbGet.getAssignment(assignment_id);
    }).then(assignmentGet => {
        assignment = assignmentGet;
        const group = {
            name: req.body.name,
            description: req.body.description,
            schedule: req.body.schedule,
            school: user.school,
            course: assignment.course,
            assignment: assignment._id,
            maxMembers: assignment.maxMembers,
            owner: user._id
        };
        return dbCreate.createGroup(group.name, group.description, group.schedule,
        group.school, group.course, group.assignment, group.maxMembers,
        group.owner);
    }).then(group => {
        user.groups.push(group._id);
        assignment.groups.push(group._id);
        user.save();
        assignment.save();
        res.send(group);
    }).catch(error => {
        res.status(400).send(error);
    })
});

// Create merge request.
router.post("/merge/:mergeRequestor/:mergeTarget", (req, res) => {
    let userId;

    if(!ObjectID.isValid(req.params.mergeRequestor)) {
        res.status(400).send("Invalid requestor id.");
        return;
    }
    if(!ObjectID.isValid(req.params.mergeTarget)) {
        res.status(400).send("Invalid target id.");
        return;
    }

    dbLogin.verifyRequest(req).then(user => {
        if(!user) {
            throw "Owner not logged in!";
        }
        userId = user;
        return dbGet.getGroup(req.params.mergeRequestor);
    }).then(group => {
        if(!group) {
            if(userId != req.params.mergeRequestor) {
                throw "Cannot request merge as non user!";
            }
            return requestMergeUser(req, res, userId, dbGet.getUser(userId));
        } else {
            return requestMergeGroup(req, res, userId, Promise.resolve(group));
        }
    }).catch(error => {
        res.status(400).send(error);
    });
});

function requestMergeGroup(req, res, userId, promise) {
    let requestor;
    let target;
    return promise.then(group => {
        requestor = group;
        if(group.owner != userId) {
            throw "Owner not logged in!";
        }
        return dbGet.getGroup(req.params.mergeTarget);
    }).then(group => {
        target = group;
        if(target.assignment != requestor.assignment) {
            throw "Groups cannot merge as they are not part of the same assignment!";
        }
        if(target._doc.requests.find(el => el.id.toString() == requestor._id.toString())) {
            throw "This group has already requested to join target group!";
        }
        target._doc.requests.push({isUser: false, id: requestor._id});
        return target.save();
    }).then(() => {
        res.send("Request sent!");
    });
}

function requestMergeUser(req, res, userId, promise) {
    let requestor;
    let target;
    return promise.then(user => {
        requestor = user;
        return dbGet.getGroup(req.params.mergeTarget);
    }).then(group => {
        target = group;
        if(requestor.courses.find(el => el == target.course)) {
            throw "User cannot join group as they are not in this course!";
        }
        if(target._doc.requests.find(el => el.id.toString() == userId)) {
            throw "This group has already requested to join target group!";
        }
        target._doc.requests.push({isUser: true, id: userId});
        return target.save();
    }).then(() => {
        res.send("Request sent!");
    });
}

router.delete("/merge/:mergeRequestor/:mergeTarget", (req, res) => {
    let userId;

    if(!ObjectID.isValid(req.params.mergeRequestor)) {
        res.status(400).send("Invalid requestor id.");
        return;
    }
    if(!ObjectID.isValid(req.params.mergeTarget)) {
        res.status(400).send("Invalid target id.");
        return;
    }

    dbLogin.verifyRequest(req).then(user => {
        if(!user) {
            throw "Owner not logged in!";
        }
        userId = user;
        return dbGet.getGroup(req.params.mergeRequestor);
    }).then(group => {
        if(!group) {
            if(userId != req.params.mergeRequestor) {
                throw "Cannot request merge as non user!";
            }
            return deleteMergeRequest(req, res, userId, true, dbGet.getUser(userId));
        } else {
            return deleteMergeRequest(req, res, userId, false, Promise.resolve(group));
        }
    }).catch(error => {
        console.log(error);
        res.status(400).send(error);
    });
});

function deleteMergeRequest(req, res, userId, isUser, promise) {
    let requestor;
    let target;
    return promise.then(group => {
        requestor = group;
        return dbGet.getGroup(req.params.mergeTarget);
    }).then(group => {
        target = group;
        if(target.owner != userId && !isUser && requestor.owner != userId) {
            throw isUser ? "Cannot delete merge as non user!" : "Owner not logged in!";
        }
        target.requests = target._doc.requests.filter(el => el.id.toString() != requestor._id.toString());
        return target.save();
    }).then(() => {
        res.send("Request deleted!");
    })
}

router.put("/merge/:mergeRequestor/:mergeTarget", (req, res) => {
    let userId;
    let target;

    if(!ObjectID.isValid(req.params.mergeRequestor)) {
        res.status(400).send("Invalid requestor id.");
        return;
    }
    if(!ObjectID.isValid(req.params.mergeTarget)) {
        res.status(400).send("Invalid target id.");
        return;
    }
    
    dbLogin.verifyRequest(req).then(user => {
        if(!user) {
            throw "Owner not logged in!";
        }
        userId = user;
        return dbGet.getGroup(req.params.mergeTarget);
    }).then(group => {
        target = group;
        if(target.owner != userId) {
            throw "Owner not logged in!";
        }
        const request = target._doc.requests.find(el => el._id.toString() == req.params.mergeRequestor.toString());
        if(!request) {
            throw "Requesting group has not requested to join you!";
        }
        if(request.isUser) {
            if(userId != req.params.mergeRequestor) {
                throw "Cannot request merge as non user!";
            }
            return mergeUser(req, res, target, dbGet.getUser(userId));
        } else {
            return mergeGroups(req, res, target, dbGet.getGroup(req.params.mergeRequestor));
        }
    }).catch(error => {
        res.status(400).send(error);
    });
});

function mergeGroups(req, res, target, promise) {
    let requestor;
    return promise.then(group => {
        requestor = group;
        if(target.members.length + requestor.members.length > target.maxMembers) {
            throw "Too many members in group!";
        }
        target._doc.members.concat(requestor.members);
        target._doc.requests = target._doc.requests.filter(el => el._id != requestor._id);
        // For every member in the requesting team, find the idea of the requestor in their groups list
        // then replace it with the target team id.
        return forEach(requestor.members, (memberId) => {
            return dbGet.getUser(memberId).then(member => {
                member._doc.groups = member._doc.groups.map(el => el == requestor._id ? target._id : el);
                return member.save();
            });
        }).then(() => {
            // Delete the requesting group.
            return Group.deleteOne({_id: requestor._id});
        });
    }).then(() => {
        return target.save({new: true});
    }).then(save => {
        res.send(save);
    });
}

function mergeUser(req, res, target, promise) {
    let requestor;
    return promise.then(user => {
        requestor = user;
        if(target.members.length + 1 > target.maxMembers) {
            throw "Too many members in group!";
        }
        target._doc.members.push(requestor._id);
        target._doc.requests = target._doc.requests.filter(el => el._id != requestor._id);
        // For every member in the requesting team, find the idea of the requestor in their groups list
        // then replace it with the target team id.
        requestor._doc.groups.push(target._id);
        return requestor.save();
    }).then(() => {
        return target.save({new: true});
    }).then(save => {
        res.send(save);
    });
}

router.get("/full/:id", (req, res) => {
    let group;
    dbGet.getGroup(req.params.id).then(groupData => {
        group = groupData._doc;
        return dbGet.getSchool(group.school);
    }).then(school => {
        group.school = school;
        return dbGet.getCourse(group.course);
    }).then(course => {
        group.course = course;
        return dbGet.getAssignment(group.assignment);
    }).then(assignment => {
        group.assignment = assignment;
        return getArrData(group.members, dbGet.getUser);
    }).then(members => {
        group.members = members.map(member => obfuscateUser(member));
        res.send(group);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error);
    });
});

router.get("/:id", (req, res) => {
    dbGet.getGroup(req.params.id).then(user => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get("/name/:name", (req, res) => {
	dbGet.getGroupByPartialName(req.params.name).then(groups =>{
		res.send(groups);
	}).catch((error) => {
		res.status(400).send(error);
	});
});

module.exports = router
