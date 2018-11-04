// maximum number of members for this assignment
const maxNumMembers = 5;
// the row which holds all group entries
const $groupsRow = $("#all-groups-container").find(".row");


// Add group to "All Groups" section of page.
function addGroup(groupName, numMembers) {
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "all-groups-entry card"});
    const $title = $("<h5>").text(groupName);
    const $numMembersContainer = $("<div>", {class: "num-group-members-container"});
    // adding all filled-in icons
    let i;
    for (i = 0; i < numMembers; i++) {
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

setUserGroup({name: "Bullish Frogs", numMembers: 4,
              members: ["Priya", "Jerry", "Andriy", "Brennan"]});
addGroup("Hip Hippos", 2);
addGroup("Peckish Penguins", 1);
addGroup("Sinewy Centaurs", 5);
addGroup("Diligent Dingos", 4);
addGroup("Witty Walruses", 3);
addGroup("Sagacious Squids", 1);
