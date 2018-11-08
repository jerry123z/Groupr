// global arrays
const classes = [] // Array of books owned by the library (whether they are loaned or not)
const classSearchForm = document.querySelector('#classSearchForm');
const editUserForm = document.querySelector('#allDisplays');


class Class {
	constructor(code, name, members, active) {
		this.code = code;
		this.name = name;
		this.members = members;
		this.active = active;
	}
}

classes.push(new Class('CSC309', 'Web Design', 12345, 'Jan 1, 2018'));
classes.push(new Class('CSC411', 'Machine Learning', 444, 'Jan 2, 2018'));
classes.push(new Class('CSC401', 'Natural Language Processing', 555, 'Jan 3, 2018'));
classes.push(new Class('CSC343', 'Databases', 900, 'Jan 4, 2018'));
classes.push(new Class('CSC324', 'Principles of Programming Languages', 73, 'Jan 5, 2018'));

classSearchForm.addEventListener('input', searchUser);
editUserForm.addEventListener('click', editUser);

function editUser(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("p");
		console.log(info);
		code = info[0].textContent.split(":")[1].trim();
		name = info[1].textContent.split(":")[1].trim();
		members = info[2].textContent.split(":")[1].trim();
		active = info[3].textContent.split(":")[1].trim();
		window.location.href = "classEdit.html?name=" + name + "&members=" + members + "&active=" + active + "&code=" + code;	
	}
}


function searchUser(e) {
	e.preventDefault();
	
	document.getElementById('allDisplays').innerHTML = "";
	let code = classSearchForm.querySelector('#classCode').value;
	if(code == ""){
		document.getElementById('allDisplays').innerHTML = "";
		return;
	}
	for(var i = 0; i < classes.length; i++){
		if(classes[i].code.includes(code)){
			displayUser(classes[i]);
		}
	}
}

function displayUser(varclass){
	let markup = `
	<div id = "innerWrapper">
		<div id = "classDisplay" class = "class-entry">
			<div id = "classInfo">
				<p><b>Code:</b> ${varclass.code}</p>
				<p><b>Name:</b> ${varclass.name}</p>
				<p><b>Number of Members:</b> ${varclass.members}</p>
				<p><b>Last Updated:</b> ${varclass.active}</p>
			</div>
			<div id = "buttons">
				<div id = "innerWrapper">
					<button class = "button">Edit</button>
				</div>
			</div>
		</div>
	</div>
	`;
	
	let display = document.getElementById('allDisplays');
	display.innerHTML += markup;
}
