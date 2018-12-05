// Information about the user currently logged in
let currentUser;

$(document).on("loggedin", function(event, user) {
    currentUser = user;
    populateSideNav(user);
});

// Popualte side nav bar with data
function populateSideNav(user) {
    getUserData(user._id).then(userData => {
        // Extract courses and assignments associated with user into the format
        // expected by insertNavHTML
        let assignments = [];
        let courses = [];
        let i = 0;
        for (let i = 0; i < userData.courses.length; i++) {
            let course = userData.courses[i];
            courses.push(course.name);
            assignments[i] = [];
            for (let j = 0; j < userData.assignments.length; j++) {
                let assignment = userData.assignments[j];
                if (course._id == assignment.course) {
                    assignments[i].push(assignment.name);
                }
            }
        }
        insertNavHTML(courses, assignments);
    }).catch(error => {
        console.error(error);
    });
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

function getUserData(userId) {
    return fetch("/user/full/" + userId, {
        method: "GET"
    }).then(parseBody);
}

function getAllCourseData() {
    return fetch("/course", {
        method: "GET"
    }).then(parseBody);
}

function logout() {
    fetch("/login", {
        method: "DELETE"
    }).then(response => {
        console.log(response)
        if(response.status == 200) {
            window.location.replace("./login.html");
        }
    }).catch(error => {
        console.error(error);
    });
}

// given courses and assingments, create the HTML of the navbar
function insertNavHTML(user_courses, assignments){
    //logout
    let listItem = $('<li></li>');
    listItem.addClass("nav-item");
    let anchor = $('<a class="nav-link" href="#"></a>');
    let span = $('<span>Logout</span>');
    anchor.click(logout);
    anchor.append(span);
    listItem.append(anchor);
    $("#nav").append(listItem);

    //profile
    listItem = $('<li></li>');
    listItem.addClass("nav-item");
    anchor = $('<a class="nav-link" href="./profile.html"></a>');
    span = $('<span>Profile</span>');
    anchor.append(span);
    listItem.append(anchor);
    $("#nav").append(listItem);

    //courses
    let i;
    let j;
    for (i = 0; i < user_courses.length; i++ ){
        let listItem = $('<li></li>');
        listItem.addClass("nav-item");
        listItem.addClass("dropdown")
        let anchor = $( '<a class="nav-link dropdown-toggle collapsed" href="#SubMenu' + user_courses[i] +
            '"  role="button" data-toggle="collapse"  aria-expanded="false"></a>');
        let id = $('<span>'.concat(user_courses[i], '</span>'));
        anchor.append(id);
        listItem.append(anchor);
        const containerDiv = $('<div id="SubMenu' + user_courses[i] + '" class="collapse"></div>');
        let ulist = $( '<ul class="list-unstyled dropdown-menu show"></ul>' );
        if (assignments[i].length == 0) {
            let noAssignmentsMessage = $('<li><a class="dropdown-item"> No Assignments Yet!</a></li>');
            ulist.append(noAssignmentsMessage);
        } else {
            for(j = 0; j < assignments[i].length; j++){
                let listItem = $('<li></li>');
                let anchor = $('<a class="dropdown-item" href="./assignment.html">'.concat(assignments[i][j],'</a>'));
                listItem.append(anchor);
                ulist.append(listItem);
            }
        }
        containerDiv.append(ulist);
        listItem.append(containerDiv);
        $("#nav").append(listItem);
    }
    let divider = $('<li><div id="course-divider" class="dropdown-divider"></div></li>');
    let addCourseItem = $('<li id="add-course-item" class="nav-item"></li>');
    let addCourseLink = $('<a id="add-course-link" class="nav-link" data-toggle="modal" data-target="#addModal"></a>');
    addCourseLink.append($('<span> Add Course </span>'));
    addCourseItem.append(addCourseLink);
    $("#nav").append(divider);
    $("#nav").append(addCourseItem);
}

function eraseNavHTML() {
    $("#nav li").remove();
}

// Display error/success message to user
function displayMessage(message, color) {
    $("#message").css("color", color);
    $("#message").html(message);
}

function hideMessage() {
    $("#message").html("");
}

// Return the id of the course with specified name
function findCourseIdByName(courses, name) {
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].name == name) {
            return courses[i]._id;
        }
    };
    return null;
}

function addUserToCourse(userId, courseId) {
    return fetch("/user/course/" + userId + "/" + courseId, {
        method: "PATCH"
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

$("#submit-btn").click((e) => {
    const name = $("#course-name").val().trim();

    getUserData(currentUser._id).then(user => {
        getAllCourseData().then(courses => {
            let courseId = findCourseIdByName(courses, name);
            if (courseId) {
                addUserToCourse(user._id, courseId).then(response => {
                    displayMessage("Successfully enrolled in " + name, "green");
                    // Update the navbar to reflect change
                    eraseNavHTML();
                    populateSideNav(currentUser);
                }).catch(error => {
                    displayMessage("User already enrolled in " + name, "red");
                });
            } else {
                displayMessage("Course " + name + " not found", "red");
            }
        });
    });
});

// Hide error/success messages on modal close
$('#addModal').on('hidden.bs.modal', () => {
    hideMessage();
})
