// global arrays
const userSearchForm = document.querySelector('#userSearchForm');
const editUserForm = document.querySelector('#allDisplays');

var users = [];

userSearchForm.addEventListener('input', searchUser);
editUserForm.addEventListener('click', editUser);

function editUser(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("p");
		name = info[0].textContent.split(":")[1].trim();
		email = info[1].textContent.split(":")[1].trim();
		school = info[2].textContent.split(":")[1].trim();
		active = info[3].textContent.split(":")[1].trim();

		let ind = users.findIndex(o => o.email == email);
		window.location.href = "userEdit.html?id=" + users[ind]._id;
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
	searchUsers(email)
}

function searchUsers(email) {
	fetch('/user/email/' + email).then(response => {
			if(response.status === 200) {
					return response.json();
			} else {
					throw response;
			}
	}).then(userArray => {
		users = userArray
		return userArray
	}).then(userArray => {
		return getSchoolNames(userArray) //race condition
	}).then(userArray => {

		userArray.forEach(u => displayUser(u))
	}).catch(error => {
		console.error(error)
	})
}


function getSchoolNames(userArray){
	return new Promise(function(resolve, reject) {
		for(let i = 0; i< userArray.length; i++){
			fetch('/school/' + userArray[i].school).then(response => {
					if(response.status === 200) {
							return response.json();
					} else {
							throw response;
					}
			}).then((schoolObj) => {
				userArray[i].school = schoolObj.name
				if (i == userArray.length-1){
					resolve(userArray)
				}
			}).catch(error => {
				reject(error)
			})
		}
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
