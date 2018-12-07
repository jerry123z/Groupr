// global arrays
const classes = [] // Array of books owned by the library (whether they are loaned or not)
const classSearchForm = document.querySelector('#classSearchForm');
const editUserForm = document.querySelector('#allDisplays');

let schoolsArray = []

classSearchForm.addEventListener('input', searchUser);
editUserForm.addEventListener('click', editUser);
createCourseForm.addEventListener('submit', addCourse);

function create_signup_schools(schools) {
    schools.forEach(school => {
        $("#create-school").append($("<option></option>").val(school._id).text(school.name));
    });
}

$('document').ready(function () {
	fetch('/school', {
		method: "GET",
		headers: { 'Content-Type': "application/json" }
	}).then((response) => {
		if(response.status === 200) {
			return response.json();
		} else {
			throw response;
		}
	}).then(json => {
		create_signup_schools(json);
	}).catch(error => {
		console.log(error)
	})
})

function addCourse(e){
	e.preventDefault();
	var name = createCourseForm.querySelector('#newCourseName').value;
	var school = createCourseForm.querySelector('#create-school').value;
	console.log(school)
	fetch('/course/'+school, {
		method: "POST",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify({ name })
	}).then(response => {
		if(response.status === 200) {
			return response.json();
		}else{
			throw response;
		}
	}).then(groupRes => {
		if (document.getElementById("createResponse").hasAttribute("hidden")){
        	document.getElementById("createResponse").removeAttribute("hidden")
		}
	}).catch(error => {
		document.getElementById("createError").innerHTML = error
	})
}

function editUser(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("p");
		window.location.href = "classEdit.html?id=" + info[2].textContent;

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
	fetch('/course/name/' + name).then(response => {
			if(response.status === 200) {
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
				<p hidden>${varclass._id}</p>
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
