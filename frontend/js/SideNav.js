$(document).on("loggedin", function(event, user) {
    getUserData(user._id).then(userData => {
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
        populate_side_nav(courses, assignments);
    }).catch(error => {
        console.error(error);
    });
});

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
    let userData;
    return fetch("/user/full/" + userId, {
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

function populate_side_nav(user_courses, assignments){
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

$('#addModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget) // Button that triggered the modal
  let course = button.data('course') // Extract info from data-* attributes
  let modal = $(this)
  if (course) {     // User is adding an assignment
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      modal.find('#assignment-form-group').css("display", "block")  // Display assignment form group
      modal.find('.modal-title').text('Add ' + course + ' Assignment')
  } else {          // User is adding a course
      modal.find('#course-form-group').css("display", "block")  // Display course form group
      modal.find('.modal-title').text('Add Course')
  }
})

$('#addModal').on('hidden.bs.modal', function (event) {
    // Make form groups invisible on modal close, as preparation for the next
    // time the modal opens
    $(this).find('.form-group').css("display", "none");
})
