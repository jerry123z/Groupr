const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.",
                "Sept.", "Oct.", "Nov.", "Dec."];
const allNotifications = [
    {username: "Priya", action: "joined", group: "Bullish Frogs", datetime: new Date("October 14, 2018 18:45:12") },
    {username: "Brennan", action: "left", group: "Reckless Rhinos", datetime: new Date("October 4, 2018 11:33:12") }
];

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

// Add notification to "Group Notifications" section of page
// "notification" is an object with keys username, action, group, and datetime.
function addNotification(notification) {
    // create all elements needed
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "notification-entry entry card"});
    const $action = $("<span>", {class: notification.action}).text(notification.action);
    // format close button and add on-click behaviour
    const $close = $("<span>", {class: "close"})
    $close.get(0).innerHTML = "&times;";
    $close.click(removeNotification);
    // format notification title
    const $title = $("<h5>", {class: "notification-header"});
    $title.append(document.createTextNode(notification.username + " "));
    $title.append($action);
    $title.append(document.createTextNode(" " + notification.group));
    // format notification date
    const $datetime = $("<span>", {class: "notification-datetime"});
    $datetime.text(formatDate(notification.datetime));
    // add all elements to the DOM
    $container.append($("<div>"));
    $container.find("div").append($close);
    $container.append($title);
    $container.append($datetime);
    $col.append($container);
    $notificationsRow.append($col);
}

// Given Javascript date object date, return a string in the following format:
// " hours:minutes:(AM/PM), month:day". Helper function for addNotification.
function formatDate(date) {
    const hours = date.getHours();
    const meridiem = hours < 12 ? "AM" : "PM";
    const hoursAdjusted = hours <= 12 ? hours : hours - 12;
    const month = months[date.getMonth()];
    return `${hoursAdjusted}:${date.getMinutes()}${meridiem}, ${month} ${date.getDate()}`;
}

// Remove notification 'this' from 'Group Notifications' section.
function removeNotification() {
    const entry = $(this).parent().parent().parent();
    entry.remove();
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
        // add notifiations to the page (REQUIRES SERVER CALL)
        $.each(allNotifications, (index, n) => addNotification(n));
    }).catch(error => {
        console.error(error);
    });
});
