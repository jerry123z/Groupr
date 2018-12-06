// the id of the group associated with this page
let groupId;
// the information about the group associated with this page
let currentGroup;
// the row which holds all group entries
const $requestsRow = $("#requests-container").find(".row");

// Set user's group (top of the page) to group.
// If group is null, remove the group container from the page.
function setUserGroup(group, user) {
    if (!group) {
        $("#group-container").remove();
    } else {
        $("#group-name").text(group.name);
        $("#course_and_assignment_names").text(`${group.course.name}: ${group.assignment.name}`);
        const $numMembersContainer = $("#number-members-container");
        // adding all filled-in icons
        let i;
        for (i = 0; i < group.members.length; i++) {
            let $icon = $("<img>", {class: "big-user-icon",
                                     src:"content/person_filled.png"});
            $numMembersContainer.append($icon);
        }
        // adding all unfilled icons
        for (; i < group.maxMembers; i++) {
            const $icon = $("<img>", {class: "big-user-icon",
                                      src: "content/person_unfilled.png"});
            $numMembersContainer.append($icon);
        }
        // Add the member list. Also put a crown next to the owner and make the user blue.
        const membersList = group.members.map(member => {
            const kick = member._id != group.owner ? `<img data-uid='${member._id}' class='member_kick' src='content/kick.png'>` : ``;
            const crown = member._id == group.owner ? `<img class='member_crown' src='content/crown.png'>` : ``;
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
        $("#posting_requirements").text(group.description);
        // Add appropriate buttons to the page
        if(group.members.find((member) => member._id == user._id))
        {
            $('#requestJoinButton').remove();
            $('#leaveGroupButton').click(event => {
                $('#leaveGroupButton').removeClass('btn-danger')
                    .addClass('btn-secondary');
            });
            if (user._id != group.owner) {
                $('#editGroupButton').remove();
            }
        }
        else
        {
            $('#requests-header').remove();
            $('#editGroupButton').remove();
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
    $container.attr('data-toggle', 'modal');
    $container.attr('data-target', '#requestModal');
    $container.attr('data-gid', group._id);

    $container.append($title);
    $container.append($numMembersContainer);
    $col.append($container);
    $requestsRow.append($col);
}

function setupMergeModal(user)
{
    $('#requestModal').on('show.bs.modal', event => {
        const button = $(event.relatedTarget);
        const gid = button.data('gid');
        openMergeModal(group.requests.find(group => group._id == gid), user);
    });
}


function openMergeModal(group, user) {
    $("#requestModalLabel").text(group.name);
    $("#requestModalLabel").attr('href', "group_page.html?gid=" + group._id);
    const $numMembersContainer = $("#request-members-icons");
    $numMembersContainer.empty();
    // adding all filled-in icons
    let i;
    for (i = 0; i < group.members.length; i++) {
        let $icon = $("<img>", {class: "big-user-icon",
                                    src:"content/person_filled.png"});
        $numMembersContainer.append($icon);
    }
    // adding all unfilled icons
    for (; i < group.maxMembers; i++) {
        const $icon = $("<img>", {class: "big-user-icon",
                                    src: "content/person_unfilled.png"});
        $numMembersContainer.append($icon);
    }
    // Add the member list. Also put a crown next to the owner and make the user blue.
    const membersList = group.members.map(member => {
        const crown = member._id == group.owner ? `<img class='member_crown' src='content/crown.png'>` : ``;
        return member._id == user._id ? `<li class='member_you'> ${member} ${crown} </li>` : `<li> ${member} ${crown} </li>`;
    });
    // Attach the member list.
    const $memberContainer = $("#request-members").find("ul");
    $memberContainer.empty();
    $memberContainer.append(membersList.join(""));
}

function addAvailability(group)
{
    // add schedule to the page
    $(".schedule").dayScheduleSelector({
        startTime: '08:00',
        endTime: '24:00',
        interval: 60
    });
    $(".schedule").data('artsy.dayScheduleSelector').deserialize(group.schedule);
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

function getData(group) {
    return fetch("/group/full/" + group, {
        method: "GET"
    }).then(parseBody);
}

function setGroupId() {
    let url = new URL(window.location.href);
    groupId = url.searchParams.get("gid");
}

// Fill in input values with current group info on edit modal open
$('#editModal').on('show.bs.modal', event => {
    $("#name-input").attr("value", currentGroup.name);
    $("#desc-input").text(currentGroup.description);
    $("#group-form-schedule").data('artsy.dayScheduleSelector').deserialize(currentGroup.schedule);
});

$("#submit-group").click((e) => {
    const name = $("#name-input").val();
    const description = $("#desc-input").val();
    const schedule = $("#group-form-schedule").data('artsy.dayScheduleSelector').serialize();
    sendEditGroupRequest(name, description, schedule).then(res => {
        // refresh page on success
        location.reload();
    }).catch(error => {
        console.error("Error editing group");
    });
});

function sendEditGroupRequest(name, description, schedule) {
    return fetch("/group/" + groupId, {
        method: "PATCH",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ name, description, schedule })
    }).then((response) => {
        if(response.status === 200) {
            return response.json();
        } else {
            return Promise.reject(null);
        }
    }).catch(error => {
        return Promise.reject(null);
    });
}

// Populate page with information on page load
$(document).on('loggedin', function(event, user) {
    setGroupId();
    // if gid is not in url, redirect user to profile page
    if(!groupId) {
        window.location.replace("./profile.html");
        return;
    }

    getData(groupId).then(group => {
        currentGroup = group;
        setUserGroup(group, user);
        for (let i = 0; i < group.requests.length; i++) {
            addRequest(group.requests[i]);
        }
        addAvailability(group);
        setupMergeModal(user);
    });
});
