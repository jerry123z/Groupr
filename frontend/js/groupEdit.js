// global arrays
const email_regex = /[A-Za-z0-9\._]+@[A-Za-z0-9\._]+/;
const changeNameForm = document.querySelector('#changeNameForm');
const deleteClassForm = document.querySelector('#deleteClassForm');
const memberDisplayForm = document.querySelector('#membersDisplay');
const addMemberForm = document.querySelector('#addMemberForm');
var group = {}
var groupMembers = []
window.onload = getGroupInfo;
var saveUser = {}
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


function changeName(e){
	e.preventDefault();
	var name = changeNameForm.querySelector('#newName').value;

	if (name.length == 0) {
		if (document.getElementById("nameError").hasAttribute("hidden")){
        	document.getElementById("nameError").removeAttribute("hidden")
			return
		}
    }
	group.name = name;
	fetch('/group/name/' + group._id, {
		method: "PATCH",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify({ name })
	}).then(response => {
		if(response.status === 200) {
			return response.json();
		}else{
			throw response;
		}
	}).then(groupRes => {
		group = groupRes;
		if (!document.getElementById("nameError").hasAttribute("hidden")){
        	document.getElementById("nameError").setAttribute("hidden", true);
		}
		displayGroup();
	}).catch(error => {
		console.log(error);
	})
}



function deleteMember(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.getElementsByTagName("p");
		name = info[0].textContent.trim();
		let ind = groupMembers.findIndex(user => user.name == name);
		let groupId = group._id
		let userId = groupMembers[ind]._id
		fetch("./group/remove", {
			method:"PATCH",
			headers: { 'Content-Type': "application/json" },
	        body: JSON.stringify({ groupId, userId })
		}).then(response => {
				if(response.status === 200) {
						return response.json();
				} else {
						throw response;
				}
		}).then(groupRes => {
				group = groupRes;
				displayGroup();
		}).catch(error => {
				console.error(error)
		})
	}
	displayMembers();
	group.members = groupMembers.length;
	displayGroup();
}

function addMember(e){
	e.preventDefault();
	var email = addMemberForm.querySelector('#newMember').value;

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

	fetch('/user/email/' + email).then(response => {
		if(response.status === 200) {
				return response.json();
		} else {
				throw response;
		}
	}).then(user => {
		return fetch('/group/mergeAdmin/' + user[0]._id + '/' + group._id, {
			method: "PUT"})
	}).then(response => {
		if(response.status === 200) {
				return response.json();
		} else {
				throw response;
		}
	}).then(vargroup => {
		if (!(document.getElementById("emailError").hasAttribute("hidden"))){
			document.getElementById("emailError").setAttribute("hidden", true);
		}
		getGroupInfo();
	}).catch(error => {
		console.error(error);
	})
}

function getGroupInfo(){
	let url = window.location.search.substring(1);
	let parameters = url.split("&");
	for(var i = 0; i < parameters.length; i++){
		split = parameters[i].split("=");
		group[split[0]] = decodeURI(split[1]);
	}
	fetch('/group/' + group.id).then(response => {
			if(response.status === 200) {
					return response.json();
			} else {
					throw response;
			}
	}).then(groupRes => {
			group = groupRes;
			displayGroup();
			getGroupMembers(group.members);
			displayMembers()
	}).catch(error => {
			console.error(error)
	})

}


function getGroupMembers(idArray){
	groupMembers = []
	for(let i = 0; i<idArray.length; i++){
		fetch('/user/'+ idArray[i], {
			method:"GET"
		}).then((response) => {
			if(response.status === 200) {
					return response.json();
			} else {
					throw response;
			}
		}).then((member) =>{
			groupMembers.push(member)
			displayMembers()
		}).catch(error => {
			console.error(error)
		})
	}
	if (idArray.length == 0){
		displayMembers()
	}
}

function displayMembers(){
	let display = document.getElementById('membersDisplay');
	display.innerHTML = "<hr><h3> Member List </h3>"
	for(var i = 0; i < groupMembers.length; i++){
		member = groupMembers[i].name;
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
				<p><b>Number of Members:</b> ${group.members.length}</p>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML = markup;
}
