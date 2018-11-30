// global arrays
const classes = [] // Array of books owned by the library (whether they are loaned or not)
const changeNameForm = document.querySelector('#changeNameForm');
const changeMembersForm = document.querySelector('#changeMembersForm');
const changeActiveForm = document.querySelector('#changeActiveForm');
const deleteSchoolForm = document.querySelector('#deleteSchoolForm');
var school = {}

window.onload = getSchoolInfo;

changeMembersForm.addEventListener('submit', changeMembers);
changeNameForm.addEventListener('submit', changeName);
changeActiveForm.addEventListener('submit', changeActive);
deleteSchoolForm.addEventListener('submit', deleteSchool);

function deleteSchool(e){
	e.preventDefault();
	let markup = `
	<p><b>School successfully deleted</b></p>
	`
	document.getElementById("school").innerHTML = markup;
}


function changeMembers(e){
	e.preventDefault();
	var members = changeMembersForm.querySelector('#newMembers').value;
	if(!isNaN(members)){
		school.members = members;
		displaySchool();
	}
}

function changeName(e){
	e.preventDefault();
	var name = changeNameForm.querySelector('#newName').value;
	school.name = name;
	displaySchool();
}

function changeActive(e){
	e.preventDefault();
	var active = changeActiveForm.querySelector('#newActive').value;
	school.active = active;
	displaySchool();
}


function getSchoolInfo(){
	let url = window.location.search.substring(1);

		let parameters = url.split("&");
		for(var i = 0; i < parameters.length; i++){
			split = parameters[i].split("=");
			school[split[0]] = decodeURI(split[1]);
		}
		console.log(school);
		displaySchool();
	
}




function displaySchool(){
	let markup = `
	<div id = "innerWrapper">
		<div id = "schoolDisplay" class = "school-entry">
			<div id = "schoolInfo">
				<p><b>Name:</b> ${school.name}</p>
				<p><b>Number of Members:</b> ${school.members}</p>
				<p><b>Last Active:</b> ${school.active}</p>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML = markup;
}

