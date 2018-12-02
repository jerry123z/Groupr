// global arrays
var groupMembers = ['Priya', 'Jerry', 'Brennan', 'Andriy'] // Array of books owned by the library (whether they are loaned or not)
const changeNameForm = document.querySelector('#changeNameForm');
const deleteClassForm = document.querySelector('#deleteClassForm');
const memberDisplayForm = document.querySelector('#membersDisplay');
const addMemberForm = document.querySelector('#addMemberForm');
var group = {}

window.onload = getGroupInfo;

changeNameForm.addEventListener('submit', changeName);
deleteGroupForm.addEventListener('submit', deleteGroup);
addMemberForm.addEventListener('submit', addMember);
memberDisplayForm.addEventListener('click', deleteMember);

function deleteGroup(e){
	e.preventDefault();
	let markup = `
	<p><b>Group successfully deleted</b></p>
	`
	document.getElementById("group").innerHTML = markup;
}

	
	

function changeMembers(e){
	e.preventDefault();
	var members = changeMembersForm.querySelector('#newMembers').value;
	if(!isNaN(members)){
		group.members = members;
		displayGroup();
	}
}

function changeName(e){
	e.preventDefault();
	var name = changeNameForm.querySelector('#newName').value;
	group.name = name;
	displayGroup();
}



function deleteMember(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.getElementsByTagName("p");
		console.log(info);
		name = info[0].textContent.trim();
		console.log(name);
		let ind = groupMembers.findIndex(o => o == name);
		console.log(ind)
		groupMembers.splice(ind, 1)
		console.log(groupMembers);
	}
	displayMembers();
	group.members = groupMembers.length;
	displayGroup();
}

function addMember(e){
	e.preventDefault();
	var members = addMemberForm.querySelector('#newMember').value;
	console.log(members)
	groupMembers.push(members);
	displayMembers();
}

function getGroupInfo(){
	let url = window.location.search.substring(1);

	let parameters = url.split("&");
	for(var i = 0; i < parameters.length; i++){
		split = parameters[i].split("=");
		group[split[0]] = decodeURI(split[1]);
	}
	console.log(group);
	group.members = groupMembers.length;
	displayGroup();
	displayMembers();
}


function displayMembers(){
	let display = document.getElementById('membersDisplay');
	display.innerHTML = "<hr><h3> Member List </h3>"
	for(var i = 0; i < groupMembers.length; i++){
		member = groupMembers[i];
		let markup = `
		<div id = allMembers>
			<p class = "memberName">${member}</p>
			<input type = "submit" class = "button" class = "member-button" value = "Delete">
		</div>
		`
		
		display.innerHTML = display.innerHTML + markup;
	}
	
}


function displayGroup(){
	let markup = `
	<div id = "innerWrapper">
		<div id = "groupDisplay" class = "group-entry">
			<div id = "groupInfo">
				<p><b>Name:</b> ${group.name}</p>
				<p><b>Number of Members:</b> ${group.members}</p>
				<p><b>Last Active:</b> ${group.active}</p>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML = markup;
}

