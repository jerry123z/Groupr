// global arrays
const classes = [] // Array of books owned by the library (whether they are loaned or not)
const changeNameForm = document.querySelector('#changeNameForm');
const changeMembersForm = document.querySelector('#changeMembersForm');
const changeCodeForm = document.querySelector('#changeCodeForm');
const deleteClassForm = document.querySelector('#deleteClassForm');
var varclass = {}

window.onload = getClassInfo;

changeMembersForm.addEventListener('submit', changeMembers);
changeNameForm.addEventListener('submit', changeName);
changeCodeForm.addEventListener('submit', changeCode);
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
	varclass.name = name;
	displayClass();
}

function changeCode(e){
	e.preventDefault();
	var code = changeCodeForm.querySelector('#newCode').value;
	varclass.code = code;
	displayClass();
}


function getClassInfo(){
	let url = window.location.search.substring(1);

		let parameters = url.split("&");
		for(var i = 0; i < parameters.length; i++){
			split = parameters[i].split("=");
			varclass[split[0]] = decodeURI(split[1]);
		}
		console.log(varclass);
		displayClass();
	
}




function displayClass(){
	let markup = `
	<div id = "innerWrapper">
		<div id = "varclassDisplay" class = "varclass-entry">
			<div id = "varclassInfo">
				<p><b>Code:</b> ${varclass.code}</p>
				<p><b>Name:</b> ${varclass.name}</p>
				<p><b>Number of Members:</b> ${varclass.members}</p>
				<p><b>Last Active:</b> ${varclass.active}</p>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML = markup;
}

