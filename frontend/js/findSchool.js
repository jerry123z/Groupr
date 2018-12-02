// global arrays
const schools = [] // Array of books owned by the library (whether they are loaned or not)
const userSearchForm = document.querySelector('#userSearchForm');
const editSchoolForm = document.querySelector('#allDisplays');


class School {
	constructor(name, members, active) {
		this.name = name;
		this.members = members;
		this.active = active;
	}
}

schools.push(new School('University Of Toronto', 12345, 'Jan 1, 2018'));
schools.push(new School('Harvard', 444, 'Jan 2, 2018'));
schools.push(new School('UTM', 555, 'Jan 3, 2018'));
schools.push(new School('University of Toronto Scarborough', 900, 'Jan 4, 2018'));
schools.push(new School('McGill', 763, 'Jan 5, 2018'));

userSearchForm.addEventListener('input', searchUser);
editSchoolForm.addEventListener('click', editSchool);
editSchoolForm.addEventListener('click', findClass);

function editSchool(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("p");
		console.log(info);
		name = info[0].textContent.split(":")[1].trim();
		members = info[1].textContent.split(":")[1].trim();
		active = info[2].textContent.split(":")[1].trim();
		window.location.href = "schoolEdit.html?name=" + name + "&members=" + members + "&active=" + active;	
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
	for(var i = 0; i < schools.length; i++){
		if(schools[i].name.includes(name)){
			displayUser(schools[i]);
		}
	}
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
