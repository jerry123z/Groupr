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

userSearchForm.addEventListener('submit', searchUser);


function searchUser(e) {
	e.preventDefault();
	let email = userSearchForm.querySelector('#userEmail').value;
	for(var i = 0; i < users.length; i++){
		if(email == users[i].email){
			displayUser(users[i]);
		}
	}
}

function displayUser(user){
	let display = document.getElementById('userDisplay').getElementsByTagName('span');
	
	display[0].innerHTML = "Name: ".concat(user.name);
	display[1].innerHTML = "Email: ".concat(user.email);
	display[2].innerHTML = "Last Active: ".concat(user.active);
}