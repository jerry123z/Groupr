// global arrays
const classes = [] // Array of books owned by the library (whether they are loaned or not)
const changeNameForm = document.querySelector('#changeNameForm');
const changeEmailForm = document.querySelector('#changeEmailForm');
const changeSchoolForm = document.querySelector('#changeSchoolForm');
const deleteUserForm = document.querySelector('#deleteUserForm');
var user = {}

window.onload = getUserInfo;

changeEmailForm.addEventListener('submit', changeEmail);
changeNameForm.addEventListener('submit', changeName);
changeSchoolForm.addEventListener('submit', changeSchool);
deleteUserForm.addEventListener('submit', deleteUser);

function deleteUser(e){
	e.preventDefault();
	let markup = `
	<p><b>User successfully deleted</b></p>
	`
	document.getElementById("user").innerHTML = markup;
}


function changeEmail(e){
	e.preventDefault();
	var email = changeEmailForm.querySelector('#newEmail').value;
	user.email = email;
	displayUser();
}

function changeName(e){
	e.preventDefault();
	var name = changeNameForm.querySelector('#newName').value;
	user.name = name;
	displayUser();
}

function changeSchool(e){
	e.preventDefault();
	var school = changeSchoolForm.querySelector('#newSchool').value;
	user.school = school;
	displayUser();
}


function getUserInfo(){
	let url = window.location.search.substring(1);

		let parameters = url.split("&");
		for(var i = 0; i < parameters.length; i++){
			split = parameters[i].split("=");
			user[split[0]] = decodeURI(split[1]);
		}
		console.log(user);
		displayUser();
	
}




function displayUser(){
	let markup = `
	<div id = "innerWrapper">
		<div id = "userDisplay" class = "user-entry">
			<div id = "userInfo">
				<p><b>Name:</b> ${user.name}</p>
				<p><b>Email:</b> ${user.email}</p>
				<p><b>School:</b> ${user.school}</p>
				<p><b>Last Active:</b> ${user.active}</p>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML = markup;
}

