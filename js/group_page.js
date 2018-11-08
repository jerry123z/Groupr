
const groupRequests = [
    {name: "Hip Hippos", groupId: Math.floor(Math.random() * 1000000), numMembers: 2, member: ["Larry", "Velma"]},
    {name: "Peckish Penguins", groupId: Math.floor(Math.random() * 1000000), numMembers: 1, members: ["Jacob"]},
    {name: "Sinewy Centaurs", groupId: Math.floor(Math.random() * 1000000), numMembers: 5, members: ["Tyler", "Skyler", "Ashley", "Sassie", "Bessy"]},
    {name: "Diligent Dingos", groupId: Math.floor(Math.random() * 1000000), numMembers: 4, members: ["Harry", "Berry", "Mary", "Carrie"]},
    {name: "Witty Walruses", groupId: Math.floor(Math.random() * 1000000), numMembers: 3, members: ["Dawn", "Ron", 'John']},
    {name: "Sagacious Squids", groupId: Math.floor(Math.random() * 1000000), numMembers: 1, members: ["Tony"]}
]

const user = "Andriy";
const owner = "Brennan";

const userGroup = {
    name: "Bullish Frogs",
    numMembers: 4,
    members: ["Priya", "Jerry", "Andriy", "Brennan"],
    requirements: ["Available Mon/Wed/Fri mornings", "Willing to work 8 hours/week"],
    availability: {
        0: [['09:00', '11:00'], ['13:00', '16:00']],
        1: [],
        2: [['10:00', '12:00'], ['16:00', '19:00']],
        3: [['13:00', '18:00']],
        4: [['08:00', '11:00'], ['12:00', '13:00'], ['18:00', '20:00']],
        5: [],
        6: [['09:00', '12:00']]
    }
}
const maxNumMembers = 6;

// the row which holds all group entries
const $requestsRow = $("#requests-container").find(".row");

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
        // Add the member list. Also put a crown next to the owner and make the user blue.
        const membersList = group.members.map(member => {
            const crown = member == owner ? `<img class='member_crown' src='content/crown.png'>` : ``;
            return member == user ? `<li class='member_you'> ${member} ${crown} </li>` : `<li> ${member} ${crown} </li>`;
        });
        // Attach the member list.
        $("#group-members-container").find("ul").append(membersList.join(""));
        // Attach the requirement list.
        const requirementList = group.requirements.map(requirement => `<li>${requirement}</li>`);
        $("#posting_requirements").append(requirementList.join(""));
    }
}

// Add request to "Requests" section of page.
// "group" is an object with keys name and numMembers.
function addRequest(group) {
    const $col = $("<div>", {class: "col-md-4"});
    const $container = $("<div>", {class: "requests-entry group-entry group-entry-hover card"});
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
    $container.attr('data-toggle', 'modal');
    $container.attr('data-target', '#requestModal');
    $container.attr('data-gid', group.groupId);

    $container.append($title);
    $container.append($numMembersContainer);
    $col.append($container);
    $requestsRow.append($col);
}

function setupMergeModal()
{
    $('#requestModal').on('show.bs.modal', event => {
        const button = $(event.relatedTarget);
        const gid = button.data('gid');
        openMergeModal(groupRequests.filter(group => group.groupId == gid)[0]);
    });
}

function openMergeModal(group) {
    $("#requestModalLabel").text(group.name);
    $("#requestModalLabel").attr('href', "group_page.html?gid=" + group.groupId);
    const $numMembersContainer = $("#request-members-icons");
    $numMembersContainer.empty();
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
    // Add the member list. Also put a crown next to the owner and make the user blue.
    const membersList = group.members.map(member => {
        const crown = member == owner ? `<img class='member_crown' src='content/crown.png'>` : ``;
        return member == user ? `<li class='member_you'> ${member} ${crown} </li>` : `<li> ${member} ${crown} </li>`;
    });
    // Attach the member list.
    const $memberContainer = $("#request-members").find("ul");
    $memberContainer.empty();
    $memberContainer.append(membersList.join(""));
}

function addAvailability(group)
{
    // add schedule to the page
    $("#schedule").dayScheduleSelector({
        startTime: '00:00',
        endTime: '24:00',
        interval: 60
    });
    $("#schedule").data('artsy.dayScheduleSelector').deserialize(group.availability);
}

// Populate page with information on page load
$(document).ready(function() {
    setUserGroup(userGroup);
    for (let i = 0; i < groupRequests.length; i++) {
        addRequest(groupRequests[i]);
    }
    addAvailability(userGroup);
    setupMergeModal();
});
