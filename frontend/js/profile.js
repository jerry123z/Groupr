// the row which holds all group entries
const $groupsRow = $("#all-groups-container").find(".row");
// the row which holds all notification entries
const $notificationsRow = $("#notifications-container").find(".row");

// Add group to "All Groups" section of page.
function addGroup(group) {
    // create all elements needed
    const $col = $("<div>", {class: "col-md-4"});
    const $link = $("<a>", {href: `group_page.html?gid=${group._id}`});
    const $container = $("<div>", {class: "all-groups-entry entry card"});
    const $title = $("<h5>").text(`${group.course.name} ${group.assignment.name}: ${group.name}`);
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
    // add all elements to the DOM
    $container.append($title);
    $container.append($numMembersContainer);
    $link.append($container);
    $col.append($link);
    $groupsRow.append($col);
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

function getUserData(user) {
    return fetch("/user/full/" + user, {
        method: "GET"
    }).then(parseBody);
}

function getGroupData(group) {
    return fetch("/group/full/" + group, {
        method: "GET"
    }).then(parseBody);
}

function addMessageCard(message, row) {
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "no-groups-entry entry card"});
    $container.text(message);
    $col.append($container);
    row.append($col);
}

// On page load
$(document).on("loggedin", function(event, user) {
    getUserData(user._id).then(userData => {
        $('#username').text(userData.name);
        $('#school').text(userData.school.name);
        // add groups to the page
        userData.groups.forEach(group => {
            getGroupData(group._id).then(groupData => {
                addGroup(groupData);
            })
        });
    }).catch(error => {
        console.error(error);
    });
});
