// hard-coded values
const allGroups = [
    {course: "CSC309", assignment: "Project", name: "Bullish Frogs", numMembers: 4, maxNumMembers: 5},
    {course: "CSC369", assignment: "A3", name: "Reckless Rhinos", numMembers: 1, maxNumMembers: 2},
    {course: "CSC301", assignment: "Project", name: "Joyful Jaguars", numMembers: 7, maxNumMembers: 7}
];

// the row which holds all group entries
const $groupsRow = $("#all-groups-container").find(".row");

// Add group to "All Groups" section of page.
// "group" is an object with keys name and numMembers.
function addGroup(group) {
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "all-groups-entry group-entry card"});
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

    $container.append($title);
    $container.append($numMembersContainer);
    $col.append($container);
    $groupsRow.append($col);
}

// Populate page with information on page load
$(document).ready(function() {
    for (let i = 0; i < allGroups.length; i++) {
        addGroup(allGroups[i]);
    }
});
