// the id of the group associated with this page
let groupId;
// the id of the current user
let userId;
// the information about the group associated with this page
let currentGroup;
// the row which holds all group entries
const $requestsRow = $("#requests-container").find(".row");

// Set user's group (top of the page) to group.
// If group is null, remove the group container from the page.
function setUserGroup(group, user) {
    if (!group) {
        $("#group-container").remove();
    } else {
        $("#group-name").text(group.name);
        $("#course_and_assignment_names").text(`${group.course.name}: ${group.assignment.name}`);
        const $numMembersContainer = $("#number-members-container");
        // adding all filled-in icons
        let i;
        for (i = 0; i < group.members.length; i++) {
            let $icon = $("<img>", {class: "big-user-icon",
                                     src:"content/person_filled.png"});
            $numMembersContainer.append($icon);
        }
        // adding all unfilled icons
        for (; i < group.maxMembers; i++) {
            const $icon = $("<img>", {class: "big-user-icon",
                                      src: "content/person_unfilled.png"});
            $numMembersContainer.append($icon);
        }
        // Add the member list. Also put a crown next to the owner and make the user blue.
        const membersList = group.members.map(member => {
            let kick = member._id != group.owner ? `<img data-uid='${member._id}' class='member_kick' src='content/kick.png'>` : ``;
            const crown = member._id == group.owner ? `<img class='member_crown' src='content/crown.png'>` : ``;
            if (userId != group.owner) {
                kick = ``;
            }
            return member._id == user._id ? $(`<li class='member_you'> ${member.name} ${crown} ${kick} </li>`) : $(`<li> ${member.name} ${crown} ${kick} </li>`);
        });
        // Attach the member list.
        const $groupMemberContainer = $("#group-members-container");
        $groupMemberContainer.find("ul").append(membersList);
        $(".member_kick").click(event => {
            const button = $(event.target);
            const uid = button.data('uid');
            getUserData(uid).then(user => {
                $("#warning-message").text(`Are you sure you'd like to kick ${user.name}?`)
                $("#warningModal").attr("userId", user._id);
                $("#warningModal").modal("show");
            });
        });

        // Attach the requirement list.
        $("#posting_requirements").text(group.description);
        // Add appropriate buttons to the page
        if(group.members.find((member) => member._id == user._id))
        {
            $('#requestJoinButton').remove();
            $('#leaveGroupButton').click(event => {
                $('#leaveGroupButton').removeClass('btn-danger')
                    .addClass('btn-secondary');
            });
            if (user._id != group.owner) {
                $('#editGroupButton').remove();
            }
        }
        else
        {
            $('#requests-header').remove();
            $('#editGroupButton').remove();
            $('#leaveGroupButton').remove();
            $('#requestJoinButton').click(event => {
                $('#requestJoinButton').removeClass('btn-primary')
                    .addClass('btn-secondary');
            });
        }
    }
}

// Add request to "Requests" section of page.
function addRequestGroup(group) {
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "requests-entry group-entry group-entry-hover card group"});
    const $title = $("<h5>").text(group.name);
    const $numMembersContainer = $("<div>", {class: "num-group-members-container"});

    // adding all filled-in icons
    let i;
    for (i = 0; i < group.members.length; i++) {
        const $icon = $("<img>", {class: "small-user-icon",
                                  src: "content/person_filled.png"});
        $numMembersContainer.append($icon);
    }
    // adding all unfilled icons
    for (; i < group.maxMembers; i++) {
        const $icon = $("<img>", {class: "small-user-icon",
                                  src: "content/person_unfilled.png"});
        $numMembersContainer.append($icon);
    }
    $container.attr('data-toggle', 'modal');
    $container.attr('data-target', '#requestModal');
    $container.attr('data-gid', group._id);

    $container.append($title);
    $container.append($numMembersContainer);
    $col.append($container);
    $requestsRow.append($col);
}

function addRequestUser(user) {
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "requests-entry group-entry group-entry-hover card user"});
    const $title = $("<h5>").text(user.name);
    const $numMembersContainer = $("<div>", {class: "num-group-members-container"});

    const $icon = $("<img>", {class: "small-user-icon",
                              src: "content/person_filled.png"});
    $numMembersContainer.append($icon);

    $container.attr('data-toggle', 'modal');
    $container.attr('data-target', '#requestModal');
    $container.attr('data-uid', user._id);

    $container.append($title);
    $container.append($numMembersContainer);
    $col.append($container);
    $requestsRow.append($col);
}

function setupMergeModal(user)
{
    $('#requestModal').on('show.bs.modal', event => {
        const $button = $(event.relatedTarget);
        if ($button.hasClass("group")) {
            const gid = $button.data('gid');
            getGroupData(gid).then(group => {
                openMergeModalGroup(group);
            });
        } else {
            const uid = $button.data('uid');
            getUserData(uid).then(user => {
                openMergeModalUser(user);
            });
        }
    });
}

function openMergeModalUser(user) {
    $("#requestModalLabel").text("");
    $("#requestModalLabel").attr("requestor-id", user._id)
    const $numMembersContainer = $("#request-members-icons");
    $numMembersContainer.empty();
    // Add the user name to members list
    const userListItem = `<li> ${user.name} </li>`;
    // Attach the member list.
    const $memberContainer = $("#request-members").find("ul");
    $memberContainer.empty();
    $memberContainer.append(userListItem);

    let $icon = $("<img>", {class: "big-user-icon", src:"content/person_filled.png"});
    $numMembersContainer.append($icon);
}

function openMergeModalGroup(group) {
    $("#requestModalLabel").text(group.name);
    $("#requestModalLabel").attr("requestor-id", group._id)
    $("#requestModalLabel").attr('href', "group_page.html?gid=" + group._id);
    const $numMembersContainer = $("#request-members-icons");
    $numMembersContainer.empty();
    // adding all filled-in icons
    let i;
    for (i = 0; i < group.members.length; i++) {
        let $icon = $("<img>", {class: "big-user-icon",
                                    src:"content/person_filled.png"});
        $numMembersContainer.append($icon);
    }
    // adding all unfilled icons
    for (; i < group.maxMembers; i++) {
        const $icon = $("<img>", {class: "big-user-icon",
                                    src: "content/person_unfilled.png"});
        $numMembersContainer.append($icon);
    }
    // Add the member list. Also put a crown next to the owner and make the user blue.
    const membersList = group.members.map(member => {
        return `<li> ${member.name} </li>`;
    });
    // Attach the member list.
    const $memberContainer = $("#request-members").find("ul");
    $memberContainer.empty();
    $memberContainer.append(membersList.join(""));
}

$("#submit-merge").click(() => {
    const mergeRequestorId = $("#requestModalLabel").attr("requestor-id");
    closeMergeRequest(mergeRequestorId).then(response => {
        // Refresh page on success
        location.reload();
    }).catch(error => {
        console.log(error);
    });
});

function addAvailability(group)
{
    // add schedule to the page
    $(".schedule").dayScheduleSelector({
        startTime: '08:00',
        endTime: '24:00',
        interval: 60
    });
    $(".schedule").data('artsy.dayScheduleSelector').deserialize(group.schedule);
}

function parseBody(response) {
    if(response.status === 200) {
        return response.json();
    } else {
        console.error(response.body);
        return new Promise(resolve => {
            resolve(null);
        });
    }
}

function getGroupData(group) {
    return fetch("/group/full/" + group, {
        method: "GET"
    }).then(parseBody);
}

function getUserData(user) {
    return fetch("/user/full/" + user, {
        method: "GET"
    }).then(parseBody);
}

function setGroupId() {
    let url = new URL(window.location.href);
    groupId = url.searchParams.get("gid");
}

function setUserId(user) {
    userId = user._id;
}

// Fill in input values with current group info on edit modal open
$('#editModal').on('show.bs.modal', event => {
    $("#name-input").attr("value", currentGroup.name);
    $("#desc-input").text(currentGroup.description);
    $("#group-form-schedule").data('artsy.dayScheduleSelector').deserialize(currentGroup.schedule);
});

$("#submit-group").click((e) => {
    const name = $("#name-input").val();
    const description = $("#desc-input").val();
    const schedule = $("#group-form-schedule").data('artsy.dayScheduleSelector').serialize();
    sendEditGroupRequest(name, description, schedule).then(res => {
        // refresh page on success
        location.reload();
    }).catch(error => {
        console.error("Error editing group");
    });
});

// Display error/success message to user
function displayRequestMessage(message, color) {
    $("#req-message").css("color", color);
    $("#req-message").text(message);
}

$("#requestJoinButton").click(() => {
    getUserData(userId).then(user => {
        let toMerge;
        const groupToMerge = user.groups.find(group => {
            return group.assignment == currentGroup.assignment._id;
        });
        groupToMerge ? toMerge = groupToMerge._id : toMerge = user._id;
        sendMergeRequest(toMerge).then(res => {
            displayRequestMessage("Sent your request to join!", "green");
        }).catch(err => {
            displayRequestMessage("Error sending your request.", "red");
        })
    });
});

function removeMemberFromHTML(uid) {
    $(`#group-members-container ul li img[data-uid="${uid}"]`).parent().remove();
}

// Action on confirming within the warning modal
$("#confirm-btn").click(() => {
    const uid = $("#warningModal").attr("userId")
    sendRemoveUserRequest(uid).then(res => {
        removeMemberFromHTML(uid);
        $("#warningModal").modal("hide");
    }).catch(err => {
        console.log(err);
    });
})


function sendEditGroupRequest(name, description, schedule) {
    return fetch("/group/" + groupId, {
        method: "PATCH",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ name, description, schedule })
    }).then((response) => {
        if(response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(null);
        }
    }).catch(error => {
        return Promise.reject(error);
    });
}

function closeMergeRequest(mergeRequestorId) {
    return fetch("/group/merge/" + mergeRequestorId + "/" + groupId, {
        method: "PUT"
    }).then((response) => {
        if(response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(null);
        }
    }).catch(error => {
        return Promise.reject(error);
    });
}

function sendMergeRequest(mergeRequestorId) {
    return fetch("/group/merge/" + mergeRequestorId + "/" + groupId, {
        method: "POST"
    }).then((response) => {
        if(response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(null);
        }
    }).catch(error => {
        return Promise.reject(null);
    });
}

function sendRemoveUserRequest(userToKickId) {
    return fetch("/group/" + currentGroup._id + "/remove/" + userToKickId, {
        method: "PATCH",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ "groupId": currentGroup._id, "userId": userToKickId })
    }).then((response) => {
        if(response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(null);
        }
    }).catch(error => {
        return Promise.reject(null);
    });
}

// Populate page with information on page load
$(document).on('loggedin', function(event, user) {
    setGroupId();
    setUserId(user);
    // if gid is not in url, redirect user to profile page
    if(!groupId) {
        window.location.replace("./profile.html");
        return;
    }

    getGroupData(groupId).then(group => {
        currentGroup = group;
        setUserGroup(group, user);
        addAvailability(group);
        if (user._id == group.owner) {
            group.requests.forEach(request => {
                request.isUser ? addRequestUser(request.id) : addRequestGroup(request.id);
            });
            setupMergeModal(user);
        }
    });
});
