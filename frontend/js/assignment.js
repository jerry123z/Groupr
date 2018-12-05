// Assignment id of the assignment associated with this page
let assignmentId;
// All groups exisitng for the assignment associated with this page
let assignmentGroups;
// the row which holds all group entries
const $groupsRow = $("#all-groups-container").find(".row");

// Populate page with information on page load
$(document).on("loggedin", function(event, user) {
    setAssignmentId();

    // add availability to group form
    $("#schedule").dayScheduleSelector({
        startTime: '08:00',
        endTime: '24:00',
        interval: 60
    });

    // set assignment title
    getAssignmentData(assignmentId).then(assignmentData => {
        $("#assignment-name").html(`${assignmentData.course.name} - ${assignmentData.name}`);
    });

    // set user group info, or display "create a group" message if user does
    // not have a group for this assignment
    getUserData(user._id).then(userData => {
        const group = findGroupsMatchingAssignment(userData.groups, assignmentId);
        if (group) {
            return getGroupData(group._id);
        } else {
            return Promise.reject(null);
        }
    }).then(groupInfo => {
        // add user group to page, if it exists
        displayGroupHeader(true);
        setUserGroup(groupInfo);
    }).catch(() => {
        displayGroupHeader(false);
    });

    // add other users' groups to the page
    getallGroupData().then(groups => {
        assignmentGroups = groups;
        groups.forEach(group => {
            addGroup(group);
        });
    });
});

function findGroupsMatchingAssignment(groups, aId) {
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].assignment.toString() == aId.toString()) {
            return groups[i];
        }
    }
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

function getallGroupData() {
    return fetch("/group/assignment/" + assignmentId, {
        method: "GET"
    }).then(parseBody);
}

function getUserData(userId) {
    return fetch("/user/full/" + userId, {
        method: "GET"
    }).then(parseBody);
}

function getGroupData(groupId) {
    return fetch("/group/full/" + groupId, {
        method: "GET"
    }).then(parseBody);
}

function getAssignmentData(aId) {
    return fetch("/assignment/full/" + aId, {
        method: "GET"
    }).then(parseBody);
}

function setAssignmentId() {
    let url = new URL(window.location.href);
    let aId = url.searchParams.get("aid");
    if (aId) {
        assignmentId = aId;
    } else {
        // Redirect user to profile page is assignment id is not set
        window.location.replace("./profile.html");
    }
}

// Filter groups by number of spots available.
$("#spots-input").keyup(function() {
    const numSpots = parseInt($("#spots-input").val());
    if (numSpots >= 0 && assignmentGroups && assignmentGroups[0].maxMembers) {
        // Determine maxNumMembers
        let maxNumMembers = assignmentGroups[0].maxMembers;
        // remove all group entries
        $groupsRow.empty();
        // add back all groups that have numSpots or more spots available
        assignmentGroups.forEach(group => {
            const spaceAvailable = maxNumMembers - group.members.length;
            if (spaceAvailable >= numSpots) {
                addGroup(group);
            }
        });
    }
});


// Add group to "All Groups" section of page.
// "group" is an object with keys name and numMembers.
function addGroup(group) {
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "all-groups-entry group-entry card"});
    const $link = $("<a>", {href: `group_page.html?groupId=${group._id}`});
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

    $container.append($title);
    $container.append($numMembersContainer);
    $link.append($container);
    $col.append($link);
    $groupsRow.append($col);
}

// Set user's group (top of the page) to group.
// If group is null, remove the group container from the page.
function setUserGroup(group) {
    if (!group) {
        $("#group-container").remove();
    } else {
        $("#group-name").text(group.name);
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
        // setting link href appropriately
        $("#group-link").attr("href", `group_page.html?groupId=${group._id}`);
        const membersList = group.members.map(member => `<li> ${member.name} </li>`);
        $("#group-members-container").find("ul").append(membersList.join(""));
    }
}

// Display proper group header. If user has a group, display that group info div.
// If user does not have a group, display the group 'options' message.
function displayGroupHeader(hasGroup) {
    if (hasGroup) {
        $("#group-info-container").css("display", "block");
    } else {
        $("#group-options-container").css("display", "block");
    }
}

// Display group form on click of 'Create a Group' button.
$("#display-group-form").click(e => {
    $("#group-options-container").css("display", "none");
    $("#group-form-container").css("display", "block");
});

// Action taken when user submits their group form.
$('#group-form').submit(e => {
    e.preventDefault();
    const nameInput = $("#name-input").val();
    const reqInput = $("#reqs-input").val();
    const scheduleInput = $("#schedule").data('artsy.dayScheduleSelector').serialize();
});
