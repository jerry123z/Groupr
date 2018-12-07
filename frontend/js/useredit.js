// global arrays
const email_regex = /[A-Za-z0-9\._]+@[A-Za-z0-9\._]+/;
const changeNameForm = document.querySelector('#changeNameForm');
const changeEmailForm = document.querySelector('#changeEmailForm');
const changeSchoolForm = document.querySelector('#changeSchoolForm');
const deleteUserForm = document.querySelector('#deleteUserForm');
const promoteForm = document.querySelector('#promoteForm')
var userId
var user

window.onload = getUserInfo;

changeEmailForm.addEventListener('submit', changeEmail);
changeNameForm.addEventListener('submit', changeName);
changeSchoolForm.addEventListener('submit', changeSchool);
deleteUserForm.addEventListener('submit', deleteUser);
document.querySelector('#logout').addEventListener('click', logout);
promoteForm.addEventListener('submit', promoteUser);


function promoteUser(e){
	e.preventDefault();
	fetch("/user/admin/"+userId, {
		method:"PATCH",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify({ isAdmin:true })
	}).then(response => {
		if(response.status === 200) {
				return response.json();
		} else {
				throw response;
		}
	}).then(json => {
		if (document.getElementById("promoteResponse").hasAttribute("hidden")){
			document.getElementById("GiveAdmin").setAttribute("hidden", true)
		}
	}).catch(error => {
		console.error(error)
	})
}

function deleteUser(e){
	e.preventDefault();

	fetch("/user/"+userId, {method:"DELETE"}).then(user => {
		let markup = `
		<p><b>User successfully deleted</b></p>
		`
		document.getElementById("user").innerHTML = markup;
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
function changeEmail(e){
	e.preventDefault();
	var email = changeEmailForm.querySelector('#newEmail').value;
	if (!email_regex.test(email)) {
		if (document.getElementById("emailError").hasAttribute("hidden")){
        	document.getElementById("emailError").removeAttribute("hidden")
			return
		}
    } else if (email.length == 0) {
		if (document.getElementById("emailError").hasAttribute("hidden")){
        	document.getElementById("emailError").removeAttribute("hidden")
			return
		}
    }

	fetch("/user/email/"+ userId, {
		method:"PATCH",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify({ email })
	}).then(response => {
		if(response.status === 200) {
				return response.json();
		} else {
				throw response;
		}
	}).then(json => {
		if (!(document.getElementById("emailError").hasAttribute("hidden"))){
			document.getElementById("emailError").setAttribute("hidden", true);
		}
		getUserInfo()
	}).catch(error => {
		console.error(error)
	})
}

function changeName(e){
	e.preventDefault();
	var name = changeNameForm.querySelector('#newName').value;

    if (name.length == 0) {
		if (document.getElementById("nameError").hasAttribute("hidden")){
        	document.getElementById("nameError").removeAttribute("hidden")
			return
		}
    }

	fetch("/user/name/"+ userId, {
		method:"PATCH",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify({ name })
	}).then(response => {
		if(response.status === 200) {
				return response.json();
		} else {
				throw response;
		}
	}).then(json => {
		if (!document.getElementById("nameError").hasAttribute("hidden")){
        	document.getElementById("nameError").setAttribute("hidden", true);
		}
		getUserInfo()
	}).catch(error => {
			console.error(error)
	})
}

function changeSchool(e){
	e.preventDefault();
	var school = changeSchoolForm.querySelector('#newSchool').value;
	if (school.length == 0) {
		if (document.getElementById("schoolError").hasAttribute("hidden")){
        	document.getElementById("schoolError").removeAttribute("hidden")
			return
		}
    }

	fetch("/user/school/"+ userId, {
		method:"PATCH",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify({ school })
	}).then(response => {
		if(response.status === 200) {
				return response.json();
		} else {
				throw response;
		}
	}).then(json => {
		getUserInfo()
		if (!document.getElementById("schoolError").hasAttribute("hidden")){
        	document.getElementById("schoolError").setAttribute("hidden", true);
		}
	}).catch(error => {
			console.error(error)
	})
}


function getUserInfo(){
	let url = window.location.search.substring(1);

	let parameters = url.split("&");
	for(var i = 0; i < parameters.length; i++){
		split = parameters[i].split("=");
		userId = decodeURI(split[1]);
	}
	fetch('/user/full/' + userId).then(response => {
			if(response.status === 200) {
					return response.json();
			} else {
					throw response;
			}
	}).then(userJson => {
			user = userJson
			displayUser();
	}).catch(error => {
			console.error(error)
	})
}


function displayUser(){
	let markup = `
	<div id = "innerWrapper">
		<div id = "userDisplay" class = "user-entry">
			<div id = "userInfo">
				<p><b>Name:</b> ${user.name}</p>
				<p><b>Email:</b> ${user.email}</p>
				<p><b>School:</b> ${user.school.name}</p>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML = markup;
	if (user.isAdmin){
		document.getElementById("GiveAdmin").setAttribute("hidden", true)
	}
}
