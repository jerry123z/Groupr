// global arrays
const users = [] // Array of books owned by the library (whether they are loaned or not)
const userSearchForm = document.querySelector('#userSearchForm');
const editUserForm = document.querySelector('#allDisplays');

var groups = [];

userSearchForm.addEventListener('input', searchUser);
editUserForm.addEventListener('click', editUser);

function editUser(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("p");
		console.log(info);
		name = info[0].textContent.split(":")[1].trim();
		email = info[1].textContent.split(":")[1].trim();
		school = info[2].textContent.split(":")[1].trim();
		active = info[3].textContent.split(":")[1].trim();
		window.location.href = "userEdit.html?name=" + name + "&email=" + email + "&school=" + school + "&active=" + active;
	}
}

function searchUser(e) {
	e.preventDefault();
	document.getElementById('allDisplays').innerHTML = "";
	let email = userSearchForm.querySelector('#userEmail').value;
	if(email == ""){
			document.getElementById('allDisplays').innerHTML = "";
			return;
	}
	console.log("@@@@@");
	searchUsers(email)
	console.log(groups);
}

function searchUsers(email) {

	fetch('/user/email/' + email).then(response => {
			if(response.status === 200) {
					console.log(response)
					return response.json();
			} else {
					throw response;
			}
	}).then(groupArray => {
		groups = groupArray;
		return groups
	}).catch(error => {
			console.log(error)
	})


}


function displayUser(user){
	let markup = `
	<div id = "innerWrapper">
		<div id = "userDisplay" class = "user-entry">
			<div id = "userInfo">
				<p><b>Name:</b> ${user.name}</p>
				<p><b>Email:</b> ${user.email}</p>
				<p><b>School:</b> ${user.school}</p>
				<p><b>Last Active:</b> ${user.active}</p>
			</div>
			<div id = "buttons">
				<div id = "innerWrapper">
					<form id = "editUserForm">
						<input type = "submit" class = "button" value = "Edit">
					</form>
				</div>
			</div>
		</div>
	</div>
	`;


	let display = document.getElementById('allDisplays');
	display.innerHTML += markup;

}
