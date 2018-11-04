// hard-coded values
const allGroups = [
    {name: "Hip Hippos", numMembers: 2},
    {name: "Peckish Penguins", numMembers: 1},
    {name: "Sinewy Centaurs", numMembers: 5},
    {name: "Diligent Dingos", numMembers: 4},
    {name: "Witty Walruses", numMembers: 3},
    {name: "Sagacious Squids", numMembers: 1}
]
const userGroup = {
    name: "Bullish Frogs",
    numMembers: 4,
    members: ["Priya", "Jerry", "Andriy", "Brennan"]
}
const maxNumMembers = 5;

// the row which holds all group entries
const $groupsRow = $("#all-groups-container").find(".row");

// Filter groups by number of spots available.
$("#spots-input").keyup(function() {
    const numSpots = parseInt($("#spots-input").val());
    if (numSpots >= 0) {
        // remove all group entries
        $groupsRow.empty();
        // add back all groups that have numSpots or more spots available
        for (let i = 0; i < allGroups.length; i++) {
            const spaceAvailable = maxNumMembers - allGroups[i].numMembers;
            if (spaceAvailable >= numSpots) {
                addGroup(allGroups[i]);
            }
        }
    }
});


// Add group to "All Groups" section of page.
// "group" is an object with keys name and numMembers.
function addGroup(group) {
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "all-groups-entry group-entry card"});
    const $title = $("<h5>").text(group.name);
    const $numMembersContainer = $("<div>", {class: "num-group-members-container"});

    // adding all filled-in icons
    let i;
    for (i = 0; i < group.numMembers; i++) {
        const $icon = $("<img>", {class: "small-user-icon",
                                  src: "content/person_filled.png"});
        $numMembersContainer.append($icon);
    }
    // adding all unfilled icons
    for (; i < maxNumMembers; i++) {
        const $icon = $("<img>", {class: "small-user-icon",
                                  src: "content/person_unfilled.png"});
        $numMembersContainer.append($icon);
    }

    $container.append($title);
    $container.append($numMembersContainer);
    $col.append($container);
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
        for (i = 0; i < group.numMembers; i++) {
            let $icon = $("<img>", {class: "big-user-icon",
                                     src:"content/person_filled.png"});
            $numMembersContainer.append($icon);
        }
        // adding all unfilled icons
        for (; i < maxNumMembers; i++) {
            const $icon = $("<img>", {class: "big-user-icon",
                                      src: "content/person_unfilled.png"});
            $numMembersContainer.append($icon);
        }
        const membersList = group.members.map(member => `<li> ${member} </li>`);
        $("#group-members-container").find("ul").append(membersList.join(""));
    }
}

// Populate page with information on page load
$(document).ready(function() {
    setUserGroup(userGroup);
    for (let i = 0; i < allGroups.length; i++) {
        addGroup(allGroups[i]);
    }
});
