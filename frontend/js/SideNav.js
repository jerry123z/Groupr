$( document ).ready(function() {
    /*Some shit with cookies*/

    let user_courses = get_courses();
    let assignments = [];
    let i;
    for (i = 0; i < user_courses.length; i++){
        assignments[i] = get_assignments(user_courses[i]);
    }
    populate_side_nav(user_courses, assignments);

});

/*Returns a list of courses*/
function get_courses(){
    let courses = ["CSC343", "CSC369"]
    return courses;
}

/*return a list of assignments*/
function get_assignments(course){
    let assignments;
    if (course === "CSC369"){
        assignments = ["e1", "e2", "e3"];
    }
    else{
        assignments = ["A1", "A2", "A3"];
    }
    return assignments;
}

function populate_side_nav(user_courses, assignments){
    //logout
    let listItem = $('<li></li>');
    listItem.addClass("nav-item");
    let anchor = $('<a class="nav-link" href="./login.html"></a>');
    let span = $('<span>Logout</span>');
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
        for(j = 0; j < assignments[i].length; j++){
            let listItem = $('<li></li>');
            let anchor = $('<a class="dropdown-item" href="./assignment.html">'.concat(assignments[i][j],'</a>'));
            listItem.append(anchor);
            ulist.append(listItem);
        }
        containerDiv.append(ulist);
        let ending = $('<li><div class="dropdown-divider"></div></li><li>\
            <a class="dropdown-item" data-toggle="modal" data-target="#addAssignment" data-course="'.concat(user_courses[i],
                '">Add Assignment</a></li>'));
        ulist.append(ending);
        listItem.append(containerDiv);
        $("#nav").append(listItem);
    }
    let divider = $('<li><div id="course-divider" class="dropdown-divider"></div></li>');
    let addCourseItem = $('<li id="add-course-item" class="nav-item"></li>');
    let addCourseLink = $('<a id="add-course-link" class="nav-link"></a>');
    addCourseLink.append($('<span> Add Course </span>'));
    addCourseItem.append(addCourseLink);
    $("#nav").append(divider);
    $("#nav").append(addCourseItem);
}

$('#addAssignment').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var course = button.data('course') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('Add ' + course + ' Assignment')
  modal.find('.modal-body input').val(course)
})
