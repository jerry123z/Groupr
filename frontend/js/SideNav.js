// Information about the user currently logged in
let currentUser;

$(document).on("loggedin", function(event, user) {
    currentUser = user;
    populateSideNav(user);
});

// Popualte side nav bar with data
function populateSideNav(user) {
    getUserData(user._id).then(userData => {
        insertNavHTML(userData.courses, userData.assignments);
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

// Adds courses/assignments to the navbar
function insertNavHTML(courses, assignments){
    courses.forEach(course => {
        // Add course subsection
        let courseItem = $('<li class="nav-item dropdown course-item"></li>');
        let anchor = $( '<a class="nav-link dropdown-toggle collapsed" href="#SubMenu' + course.name +
            '"  role="button" data-toggle="collapse"  aria-expanded="false"></a>');
        let id = $('<span>' + course.name +  '</span>');
        anchor.append(id);
        courseItem.append(anchor);
        let containerDiv = $('<div id="SubMenu' + course.name + '" class="collapse"></div>');
        let alist = $( '<ul class="list-unstyled dropdown-menu show"></ul>' );

        // Add assignments to course subsection
        course.assignments.forEach(assignment => {
                let link = "./assignment.html?aid=" + assignment._id;
                let assignmentItem = $('<li><a class="dropdown-item" href="' + link + '">' + assignment.name + '</a></li>');
                alist.append(assignmentItem);
        });
        // Add message if course has no assignments
        if (course.assignments.length == 0) {
            alist.append('<li><a class="dropdown-item"> No Assignments Yet!</a></li>');
        }
        // Add course item to DOM
        containerDiv.append(alist);
        courseItem.append(containerDiv);
        $("#profile-item").after(courseItem);
    });
}

// Removes courses/assignments from the navbar
function eraseNavHTML() {
    $("#nav .course-item").remove();
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
                    displayMessage("You're already enrolled in " + name, "red");
                });
            } else {
                displayMessage("Course " + name + " not found", "red");
            }
        });
    });
});

$("#logout-btn").click(logout);

// Hide error/success messages on modal close
$('#addModal').on('hidden.bs.modal', () => {
    hideMessage();
})
