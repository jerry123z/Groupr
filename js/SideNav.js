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
    let i;
    let j;
    for (i = 0; i < user_courses.length; i++ ){
        let listItem = $('<li></li>');
        listItem.addClass("nav-item dropdown");
        let anchor = $( '<a class="nav-link dropdown-toggle" href="#SubMenu'.concat(user_courses[i],
            '"  role="button" data-toggle="collapse"  aria-expanded="false"></a>'));
        let id = $('<span>'.concat(user_courses[i], '</span>'));
        anchor.append(id);
        listItem.append(anchor);
        let ulist = $( '<ul class="collapse list-unstyled dropdown-menu collapse" id="SubMenu'.concat(
            user_courses[i], '"></ul>'));
        for(j = 0; j < assignments[i].length; j++){
            let listItem = $('<li></li>');
            let anchor = $('<a class="dropdown-item" href="#">'.concat(assignments[i][j],'</a>'));
            listItem.append(anchor);
            ulist.append(listItem);
        }
        let ending = $('<li><div class="dropdown-divider"></div></li><li>\
            <a class="dropdown-item" href="#">Add Assignment</a></li>')
        ulist.append(ending);
        listItem.append(ulist);
        $("#nav").append(listItem);
    }
}
