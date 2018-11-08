// global arrays
const users = [] // Array of books owned by the library (whether they are loaned or not)
const userSearchForm = document.querySelector('#userSearchForm');
const editUserForm = document.querySelector('#allDisplays');



class User {
	constructor(name, email, school, active) {
		this.name = name;
		this.email = email;
		this.school = school;
		this.active = active;
	}
}

users.push(new User('Andriy', 'andriy123@gmail.com', 'University of Toronto', 'Jan 1, 2018'));
users.push(new User('Brennan', 'brennan@gmail.com', 'University of Toronto', 'Jan 2, 2018'));
users.push(new User('Priya', 'priya123@gmail.com', 'University of Toronto', 'Jan 3, 2018'));
users.push(new User('Jerry', 'jerry123@gmail.com', 'University of Toronto', 'Jan 4, 2018'));
users.push(new User('Priya2', 'priya222@gmail.com', 'University of Toronto', 'Jan 5, 2018'));

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
	for(var i = 0; i < users.length; i++){
		if(users[i].email.includes(email)){
			displayUser(users[i]);
		}
	}
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
