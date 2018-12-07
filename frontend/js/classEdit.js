// global arrays
const classes = [] // Array of books owned by the library (whether they are loaned or not)
const changeNameForm = document.querySelector('#changeNameForm');
const changeCodeForm = document.querySelector('#changeCodeForm');
const createAssignmentForm = document.querySelector('#createAssignmentForm');

var varclass = {}
var course = {}
window.onload = getClassInfo;

changeNameForm.addEventListener('submit', changeName);
createAssignmentForm.addEventListener('submit', addAssignment);

function addAssignment(e){
	e.preventDefault()
	var name = createAssignmentForm.querySelector('#newAssignmentName').value;
	var maxMembers = createAssignmentForm.querySelector('#newAssignmentMembers').value;

	fetch('/assignment/'+course.school+"/"+course._id, {
		method: "POST",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify({ name, maxMembers })
	}).then(response => {
		if(response.status === 200) {
			return response.json();
		}else{
			throw response;
		}
	}).then(json => {
		console.log(json)
		if (document.getElementById("createResponse").hasAttribute("hidden")){
        	document.getElementById("createResponse").removeAttribute("hidden")
		}
	}).catch(error => {
		//document.getElementById("createError").innerHTML = error
	})
}


function changeName(e){
	e.preventDefault();
	var name = changeNameForm.querySelector('#newName').value;
	group.name = name;
	if (name.length == 0) {
		if (document.getElementById("nameError").hasAttribute("hidden")){
        	document.getElementById("nameError").removeAttribute("hidden")
			return;
		}
  }
	fetch('/course/name/' + group._id, {
		method: "PATCH",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify({ name })
	}).then(response => {
		if(response.status === 200) {
			return response.json();
		}else{
			throw response;
		}
	}).then(groupRes => {
		if (!document.getElementById("nameError").hasAttribute("hidden")){
        	document.getElementById("nameError").setAttribute("hidden", true);
		}
		group = groupRes;
		displayClass();
	}).catch(error => {
		console.log(error);
	})
}


function getClassInfo(){
	let url = window.location.search.substring(1);

	let parameters = url.split("&");
	for(var i = 0; i < parameters.length; i++){
		split = parameters[i].split("=");
		course[split[0]] = decodeURI(split[1]);
	}
	fetch('/course/' + course.id).then(response => {
			if(response.status === 200) {
					return response.json();
			} else {
					throw response;
			}
	}).then(groupRes => {
			course = groupRes;
				displayClass();
	}).catch(error => {
			console.error(error)
	})

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


function displayClass(){
	let markup = `
	<div id = "innerWrapper">
		<div id = "varclassDisplay" class = "varclass-entry">
			<div id = "varclassInfo">
				<p><b>Code:</b> ${course.name}</p>
				<p><b>Number of Members:</b> ${course.members.length}</p>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML = markup;
}
