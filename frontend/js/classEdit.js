// global arrays
const classes = [] // Array of books owned by the library (whether they are loaned or not)
const changeNameForm = document.querySelector('#changeNameForm');
const changeMembersForm = document.querySelector('#changeMembersForm');
const changeCodeForm = document.querySelector('#changeCodeForm');
const deleteClassForm = document.querySelector('#deleteClassForm');
var varclass = {}
var group = {}
window.onload = getClassInfo;

changeMembersForm.addEventListener('submit', changeMembers);
changeNameForm.addEventListener('submit', changeName);
deleteClassForm.addEventListener('submit', deleteClass);

function deleteClass(e){
	e.preventDefault();
	let markup = `
	<p><b>Class successfully deleted</b></p>
	`
	document.getElementById("varclass").innerHTML = markup;
}


function changeMembers(e){
	e.preventDefault();
	var members = changeMembersForm.querySelector('#newMembers').value;
	if(!isNaN(members)){
		varclass.members = members;
		displayClass();
	}
}

function changeName(e){
	e.preventDefault();
	var name = changeNameForm.querySelector('#newName').value;
	group.name = name;
	fetch('/course/name/' + group._id, {
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
		displayClass();
	}).catch(error => {
		console.log(error);
	})
}


function getClassInfo(){
	let url = window.location.search.substring(1);

	let parameters = url.split("&");
	for(var i = 0; i < parameters.length; i++){
		split = parameters[i].split("=");
		group[split[0]] = decodeURI(split[1]);
	}
	fetch('/course/' + group.id).then(response => {
			if(response.status === 200) {
					return response.json();
			} else {
					throw response;
			}
	}).then(groupRes => {
			group = groupRes;
				displayClass();
	}).catch(error => {
			console.error(error)
	})

}





function displayClass(){
	let markup = `
	<div id = "innerWrapper">
		<div id = "varclassDisplay" class = "varclass-entry">
			<div id = "varclassInfo">
				<p><b>Code:</b> ${group.name}</p>
				<p><b>Number of Members:</b> ${group.members.length}</p>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML = markup;
}
