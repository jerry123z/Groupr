
const groupRequests = [
    {name: "Hip Hippos", _id: Math.floor(Math.random() * 1000000), numMembers: 2, members: ["Larry", "Velma"]},
    {name: "Peckish Penguins", _id: Math.floor(Math.random() * 1000000), numMembers: 1, members: ["Jacob"]},
    {name: "Sinewy Centaurs", _id: Math.floor(Math.random() * 1000000), numMembers: 5, members: ["Tyler", "Skyler", "Ashley", "Sassie", "Bessy"]},
    {name: "Diligent Dingos", _id: Math.floor(Math.random() * 1000000), numMembers: 4, members: ["Harry", "Berry", "Mary", "Carrie"]},
    {name: "Witty Walruses", _id: Math.floor(Math.random() * 1000000), numMembers: 3, members: ["Dawn", "Ron", 'John']},
    {name: "Sagacious Squids", _id: Math.floor(Math.random() * 1000000), numMembers: 1, members: ["Tony"]}
];

const user = {
    name: "Andriy",
    _id: "z9827398276398",
    school: "jnksnv0s9v9823",
    courses: ["nlkajoia882"],
    assignments: ["092hfahoifao"],
    groups: ["mkanmln89090"]
};
const owner = {
    name: "Brennan",
    _id: "z9827398276398",
    school: "jnksnv0s9v9823",
    courses: ["nlkajoia882"],
    assignments: ["092hfahoifao"],
    groups: ["mkanmln89090"]
};

const userGroup = {
    _id: "mkanmln89090",
    school: "jnksnv0s9v9823",
    course: "nlkajoia882",
    assignment: "092hfahoifao",
    name: "Bullish Frogs",
    numMembers: 4,
    members: [
        {name: "Priya", _id: "ah98fchq39809qfy", school: "jnksnv0s9v9823", courses: ["nlkajoia882"], assignments: ["092hfahoifao"], groups: ["mkanmln89090"]},
        {name: "Jerry", _id: "la02ha08fh980a", school: "jnksnv0s9v9823", courses: ["nlkajoia882"], assignments: ["092hfahoifao"], groups: ["mkanmln89090"]},
        {name: "Andriy", _id: "pa982ya9igaf", school: "jnksnv0s9v9823", courses: ["nlkajoia882"], assignments: ["092hfahoifao"], groups: ["mkanmln89090"]},
        {name: "Brennan", _id: "z9827398276398", school: "jnksnv0s9v9823", courses: ["nlkajoia882"], assignments: ["092hfahoifao"], groups: ["mkanmln89090"]}
    ],
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
            const kick = user._id == owner._id ? `<img data-uid='${member._id}' class='member_kick' src='content/kick.png'>` : ``;
            const crown = member._id == owner._id ? `<img class='member_crown' src='content/crown.png'>` : ``;
            return member._id == user._id ? $(`<li class='member_you'> ${member.name} ${crown} ${kick} </li>`) : $(`<li> ${member.name} ${crown} ${kick} </li>`);
        });
        // Attach the member list.
        const $groupMemberContainer = $("#group-members-container");
        $groupMemberContainer.find("ul").append(membersList);
        $(".member_kick").click(event => {
            const button = $(event.target);
            const uid = button.data('uid');
            console.log("Request sent!");
        });
        
        // Attach the requirement list.
        const requirementList = group.requirements.map(requirement => `<li>${requirement}</li>`);
        $("#posting_requirements").append(requirementList.join(""));
        if(group.members.find((member) => member._id == user._id))
        {
            $('#requestJoinButton').remove();
            $('#leaveGroupButton').click(event => {
                $('#leaveGroupButton').removeClass('btn-danger')
                    .addClass('btn-secondary');
            });
        }
        else
        {
            $('#leaveGroupButton').remove();
            $('#requestJoinButton').click(event => {
                $('#requestJoinButton').removeClass('btn-primary')
                    .addClass('btn-secondary');
            });
        }
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
    $container.attr('data-gid', group._id);

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
        openMergeModal(groupRequests.filter(group => group._id == gid)[0]);
    });
}

function openMergeModal(group) {
    $("#requestModalLabel").text(group.name);
    $("#requestModalLabel").attr('href', "group_page.html?gid=" + group._id);
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
        startTime: '08:00',
        endTime: '24:00',
        interval: 60
    });
    $("#schedule").data('artsy.dayScheduleSelector').deserialize(group.availability);
}

function setupEditNameButton(group)
{
    const $group_name = $('#group_name');
    const $group_name_edit = $('.group_name_edit');
    const $editable_group_name = $('#editable_group_name');
    $editable_group_name.css('display', 'none');
    $('#group_name_edit_btn').click(event => {
        $group_name.css('display', 'none');
        $group_name_edit.css('display', 'none');
        $editable_group_name.val($group_name.text());
        $editable_group_name.css('display', 'inline-block');
    });

    $editable_group_name.on('change', event => {
        $group_name.text($editable_group_name.val());
        $group_name.css('display', 'inline-block');
        $group_name_edit.css('display', 'inline-block');
        $editable_group_name.css('display', 'none');
    });
}

// Populate page with information on page load
$(document).ready(function() {
    setUserGroup(userGroup);
    for (let i = 0; i < groupRequests.length; i++) {
        addRequest(groupRequests[i]);
    }
    addAvailability(userGroup);
    setupMergeModal();
    setupEditNameButton(userGroup);
});
