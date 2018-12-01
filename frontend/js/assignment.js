// hard-coded values (REQUIRES SERVER CALL TO OBTAIN)
const allGroups = [
    {groupId: 1, name: "Hip Hippos", numMembers: 2, maxNumMembers: 5},
    {groupId: 2, name: "Peckish Penguins", numMembers: 1, maxNumMembers: 5},
    {groupId: 3, name: "Sinewy Centaurs", numMembers: 5, maxNumMembers: 5},
    {groupId: 4, name: "Diligent Dingos", numMembers: 4, maxNumMembers: 5},
    {groupId: 5, name: "Witty Walruses", numMembers: 3, maxNumMembers: 5},
    {groupId: 6, name: "Sagacious Squids", numMembers: 1, maxNumMembers: 5},
    {groupId: 6, name: "Butyraceous Barnacles", numMembers: 5, maxNumMembers: 5}
]
const userGroup = {
    groupId: 7,
    name: "Bullish Frogs",
    numMembers: 4,
    members: ["Priya", "Jerry", "Andriy", "Brennan"],
    maxNumMembers: 5
}


// the row which holds all group entries
const $groupsRow = $("#all-groups-container").find(".row");

// Filter groups by number of spots available.
$("#spots-input").keyup(function() {
    const numSpots = parseInt($("#spots-input").val());
    if (numSpots >= 0) {
        // Determine maxNumMembers
        let maxNumMembers;
        if (allGroups.length > 0) {
            maxNumMembers = allGroups[0].maxNumMembers;
        } else {
            maxNumMembers = -1;
        }
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
    const $link = $("<a>", {href: `group_page.html?groupId=${group.groupId}`});
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
    for (; i < group.maxNumMembers; i++) {
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
        for (i = 0; i < group.numMembers; i++) {
            let $icon = $("<img>", {class: "big-user-icon",
                                     src:"content/person_filled.png"});
            $numMembersContainer.append($icon);
        }
        // adding all unfilled icons
        for (; i < group.maxNumMembers; i++) {
            const $icon = $("<img>", {class: "big-user-icon",
                                      src: "content/person_unfilled.png"});
            $numMembersContainer.append($icon);
        }
        // setting link href appropriately
        $("#group-link").attr("href", `group_page.html?groupId=${group.groupId}`);
        const membersList = group.members.map(member => `<li> ${member} </li>`);
        $("#group-members-container").find("ul").append(membersList.join(""));
    }
}

// Display proper group header. If user has a group, display that group info div.
// If user does not have a group, display the group 'options' message.
function displayGroupHeader(hasGroup) {
    const groupInfo = document.querySelector("#group-info-container");
    const groupOptions = document.querySelector("#group-options-container");
    if (hasGroup) {
        groupInfo.style.display = "block";
    } else {
        groupOptions.style.display = "block";
    }
}

// Display group form on click of 'Create a Group' button.
function displayGroupForm() {
    const groupOptions = document.querySelector("#group-options-container");
    const groupForm = document.querySelector("#group-form-container");
    groupOptions.style.display = "none";
    groupForm.style.display = "block";
}

// Action taken when user submits their group form.
$('#group-form').submit(e => {
    e.preventDefault();
    const nameInput = $("#name-input").val();
    const reqInput = $("#reqs-input").val();
    const scheduleInput = $("#schedule").data('artsy.dayScheduleSelector').serialize();
    console.log(nameInput);
    console.log(reqInput);
    console.log(scheduleInput);
});


// Populate page with information on page load
$(document).ready(function() {
    // add availability to group form
    $("#schedule").dayScheduleSelector({
        startTime: '08:00',
        endTime: '24:00',
        interval: 60
    });
    // display appropriate group header
    displayGroupHeader(false);

    // add groups to page (REQUIRES SERVER CALL)
    setUserGroup(userGroup);
    for (let i = 0; i < allGroups.length; i++) {
        addGroup(allGroups[i]);
    }
});
