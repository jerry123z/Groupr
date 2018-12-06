// global arrays
const classes = [] // Array of books owned by the library (whether they are loaned or not)
const changeNameForm = document.querySelector('#changeNameForm');
var school = {}
var group = {}

window.onload = getSchoolInfo;

changeNameForm.addEventListener('submit', changeName);

function deleteSchool(e){
	e.preventDefault();
	let markup = `
	<p><b>School successfully deleted</b></p>
	`
	document.getElementById("school").innerHTML = markup;
}




function changeName(e){
	e.preventDefault();
	var name = changeNameForm.querySelector('#newName').value;
	group.name = name;
	fetch('/school/name/' + group._id, {
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
		displaySchool();
	}).catch(error => {
		console.log(error);
	})
}



function getSchoolInfo(){
	let url = window.location.search.substring(1);

	let parameters = url.split("&");
	for(var i = 0; i < parameters.length; i++){
		split = parameters[i].split("=");
		group[split[0]] = decodeURI(split[1]);
	}
	fetch('/school/' + group.id).then(response => {
			if(response.status === 200) {
					return response.json();
			} else {
					throw response;
			}
	}).then(groupRes => {
			group = groupRes;
			displaySchool();
	}).catch(error => {
			console.error(error)
	})

}




function displaySchool(){
	let markup = `
	<div id = "innerWrapper">
		<div id = "schoolDisplay" class = "school-entry">
			<div id = "schoolInfo">
				<p><b>Name:</b> ${group.name}</p>
				<p><b>Number of Members:</b> ${group.members.length}</p>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML = markup;
}
