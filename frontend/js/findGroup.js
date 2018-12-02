// global arrays
const groups = [] // Array of books owned by the library (whether they are loaned or not)
const classSearchForm = document.querySelector('#classSearchForm');
const editUserForm = document.querySelector('#allDisplays');


class Group {
	constructor(name, members, active) {
		this.name = name;
		this.members = members;
		this.active = active;
	}
}

groups.push(new Group('Raging Rhinos', 12345, 'Jan 1, 2018'));
groups.push(new Group('Cute Cats', 444, 'Jan 2, 2018'));
groups.push(new Group('Peckish Penguins', 555, 'Jan 3, 2018'));
groups.push(new Group('Friendly Foxes', 900, 'Jan 4, 2018'));
groups.push(new Group('Daring Dogs', 73, 'Jan 5, 2018'));

groupSearchForm.addEventListener('input', searchUser);
editUserForm.addEventListener('click', editUser);

function editUser(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("p");
		console.log(info);
		name = info[0].textContent.split(":")[1].trim();
		members = info[1].textContent.split(":")[1].trim();
		active = info[2].textContent.split(":")[1].trim();
		window.location.href = "groupEdit.html?name=" + name + "&members=" + members + "&active=" + active;	
	}
}


function searchUser(e) {
	e.preventDefault();
	
	document.getElementById('allDisplays').innerHTML = "";
	let name = groupSearchForm.querySelector('#groupName').value;
	if(name == ""){
		document.getElementById('allDisplays').innerHTML = "";
		return;
	}
	for(var i = 0; i < groups.length; i++){
		if(groups[i].name.includes(name)){
			displayUser(groups[i]);
		}
	}
}

function displayUser(group){
	let markup = `
	<div id = "innerWrapper">
		<div id = "groupDisplay" class = "group-entry">
			<div id = "groupInfo">
				<p><b>Name:</b> ${group.name}</p>
				<p><b>Number of Members:</b> ${group.members}</p>
				<p><b>Last Updated:</b> ${group.active}</p>
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
