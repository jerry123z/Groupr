// global arrays
const users = [] // Array of books owned by the library (whether they are loaned or not)
const userSearchForm = document.querySelector('#userSearchForm');



class User {
	constructor(name, email, active) {
		this.name = name;
		this.email = email;
		this.active = active;
	}
}

users.push(new User('Andriy', 'andriy123@gmail.com', 'Jan 1, 2018'));
users.push(new User('Brennan', 'brennan@gmail.com', 'Jan 2, 2018'));
users.push(new User('Priya', 'priya123@gmail.com', 'Jan 3, 2018'));
users.push(new User('Jerry', 'jerry123@gmail.com', 'Jan 4, 2018'));
users.push(new User('Priya2', 'priya222@gmail.com', 'Jan 5, 2018'));

userSearchForm.addEventListener('input', searchUser);


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
				<p><b>Last Active:</b> ${user.active}</p>
			</div>
			<div id = "buttons">
				<div id = "innerWrapper">
					<button class = "button">Edit</button>
				</div>
				<div id = "innerWrapper">
					<button class = "button">Delete</button>
				</div>
			</div>
		</div>
	</div>
	`;
	
	let display = document.getElementById('allDisplays');
	display.innerHTML += markup;
}
