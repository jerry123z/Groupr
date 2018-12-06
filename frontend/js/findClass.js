// global arrays
const classes = [] // Array of books owned by the library (whether they are loaned or not)
const classSearchForm = document.querySelector('#classSearchForm');
const editUserForm = document.querySelector('#allDisplays');

let groups = [];

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
	let name = classSearchForm.querySelector('#classCode').value;
	if(name == ""){
			document.getElementById('allDisplays').innerHTML = "";
			return;
	}
	console.log("@@@@@");
	fetch('/course/name/' + name).then(response => {
			if(response.status === 200) {
					console.log(response)
					return response.json();
			} else {
					throw response;
			}
	}).then(groupArray => {
		groups = groupArray;
		for(var i = 0; i < groupArray.length; i++){
				displayUser(groupArray[i]);
		}
	}).catch(error => {
			console.log(error)
	})
}

function displayUser(varclass){
	let markup = `
	<div id = "innerWrapper">
		<div id = "classDisplay" class = "class-entry">
			<div id = "classInfo">
				<p><b>Name:</b> ${varclass.name}</p>
				<p><b>Number of Members:</b> ${varclass.members.length}</p>
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
