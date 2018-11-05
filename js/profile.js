const months = [ 'January', 'February', 'March', 'April', 'May', 'June',
'July', 'August', 'September', 'October', 'November', 'December'];

// hard-coded values
const allGroups = [
    {course: "CSC309", assignment: "Project", name: "Bullish Frogs", numMembers: 4, maxNumMembers: 5},
    {course: "CSC369", assignment: "A3", name: "Reckless Rhinos", numMembers: 1, maxNumMembers: 2},
    {course: "CSC301", assignment: "Project", name: "Joyful Jaguars", numMembers: 7, maxNumMembers: 7}
];
const allNotifications = [
    {username: "Priya", action: "joined", group: "Bullish Frogs", datetime: new Date("October 14, 2018 18:45:12") },
    {username: "Brennan", action: "left", group: "Reckless Rhinos", datetime: new Date("October 4, 2018 11:33:12") }
];

// the row which holds all group entries
const $groupsRow = $("#all-groups-container").find(".row");
// the row which holds all notification entries
const $notificationsRow = $("#notifications-container").find(".row");

// Add group to "All Groups" section of page.
// "group" is an object with keys name, numMembers, and maxNumMembers.
function addGroup(group) {
    // create all elements needed
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "all-groups-entry entry card"});
    const $title = $("<h5>").text(`${group.course} ${group.assignment}: ${group.name}`);
    const $numMembersContainer = $("<div>", {class: "num-group-members-container"});
    // adding all filled-in icons
    let i;
    for (i = 0; i < group.numMembers; i++) {
        const $icon = $("<img>", {class: "small-user-icon",
                                  src: "content/person_filled.png"});
        $numMembersContainer.append($icon);
    }
    // adding all unfilled icons
    for (; i < group.maxNumMembers; i++) {
        const $icon = $("<img>", {class: "small-user-icon",
                                  src: "content/person_unfilled.png"});
        $numMembersContainer.append($icon);
    }
    // add all elements to the DOM
    $container.append($title);
    $container.append($numMembersContainer);
    $col.append($container);
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

// Populate page with information on page load
$(document).ready(function() {
    for (let i = 0; i < allGroups.length; i++) {
        addGroup(allGroups[i]);
    }
    for (let i = 0; i < allNotifications.length; i++) {
        addNotification(allNotifications[i]);
    }
});


function removeNotification(e) {
    const entry = $(this).parent().parent();
    entry.remove();
}
