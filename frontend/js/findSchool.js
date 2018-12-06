// global arrays
const userSearchForm = document.querySelector('#userSearchForm');
const editSchoolForm = document.querySelector('#allDisplays');


let groups =[];

userSearchForm.addEventListener('input', searchUser);
editSchoolForm.addEventListener('click', editSchool);
editSchoolForm.addEventListener('click', findClass);

function editSchool(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("p");
		console.log(info);
		name = info[0].textContent.split(":")[1].trim();

		let ind = groups.findIndex(o => o.name == name);
		console.log(name)
		window.location.href = "schoolEdit.html?id=" + groups[ind]._id;
	}
}

function findClass(e){
	e.preventDefault();
	if(e.target.classList.contains('findClassButton')){
		info = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("p");
		console.log(info);
		name = info[0].textContent.split(":")[1].trim();
		members = info[1].textContent.split(":")[1].trim();
		active = info[2].textContent.split(":")[1].trim();
		window.location.href = "findClass.html?name=" + name;
	}
}


function searchUser(e) {
	e.preventDefault();

	document.getElementById('allDisplays').innerHTML = "";
	let name = userSearchForm.querySelector('#userEmail').value;
	if(name == ""){
			document.getElementById('allDisplays').innerHTML = "";
			return;
	}
	console.log(name);
	fetch('/school/name/' + name).then(response => {
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

function displayUser(school){
	let markup = `
	<div id = "innerWrapper">
		<div id = "userDisplay" class = "school-entry">
			<div id = "userInfo">
				<p><b>Name:</b> ${school.name}</p>
				<p><b>Number of Members:</b> ${school.members}</p>
				<p><b>Last Updated:</b> ${school.active}</p>
			</div>
			<div id = "buttons">
				<div id = "innerWrapper">
					<button class = "button">Edit</button>
				</div>
				<div id = "innerWrapper">
					<button class = "findClassButton">FindClass</button>
				</div>
			</div>
		</div>
	</div>
	`;

	let display = document.getElementById('allDisplays');
	display.innerHTML += markup;
}
