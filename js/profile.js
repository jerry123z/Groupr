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

const schedule = {
    0: [['09:00', '11:00'], ['13:00', '16:00']],
    1: [],
    2: [['10:00', '12:00'], ['16:00', '19:00']],
    3: [['13:00', '18:00']],
    4: [['08:00', '11:00'], ['12:00', '13:00'], ['18:00', '20:00']],
    5: [],
    6: [['09:00', '12:00']]
}

// the row which holds all group entries
const $groupsRow = $("#all-groups-container").find(".row");
// the row which holds all notification entries
const $notificationsRow = $("#notifications-container").find(".row");
// the table which holds availability information
const $availabilityTable = $("#schedule");

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

// Remove notification 'this' from 'Group Notifications' section.
function removeNotification() {
    const entry = $(this).parent().parent();
    entry.remove();
}

// Save availability that the user has created. Occurs when the "Save
// Availability" button is clicked.
function saveAvailability() {
    $("#save-success-text").css({ display: "block"});
    const data = $availabilityTable.data('artsy.dayScheduleSelector').serialize();
    console.log(data);
    // TODO: actually save data (PHASE 2)
}

// On page load
$(document).ready(function() {
    // add groups to the page
    $.each(allGroups, (index, group) => addGroup(group));
    // add notifiations to the page
    $.each(allNotifications, (index, n) => addNotification(n));
    // add schedule to the page
    $("#schedule").dayScheduleSelector({
        startTime: '00:00',
        endTime: '24:00',
        interval: 60
    });
    $("#schedule").data('artsy.dayScheduleSelector').deserialize(schedule);
    // add on-click behaviour to save availability button
    $("#save-button").click(saveAvailability);
});
