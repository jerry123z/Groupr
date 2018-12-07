const classSearchForm = document.querySelector('#classSearchForm');
const editUserForm = document.querySelector('#allDisplays');

var groups = []

groupSearchForm.addEventListener('input', searchUser);
editUserForm.addEventListener('click', editUser);
document.querySelector('#logout').addEventListener('click', logout);

function editUser(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.parentElement.parentElement.getElementsByTagName("p");
		name = info[0].textContent.split(":")[1].trim();

		window.location.href = "groupEdit.html?id=" + info[2].textContent;
	}
}

function logout() {
    fetch("/login", {
        method: "DELETE"
    }).then(response => {
        console.log(response)
        if(response.status == 200) {
            window.location.replace("./login.html");
        }
    }).catch(error => {
        console.error(error);
    });
}

function searchUser(e) {
		e.preventDefault();
		document.getElementById('allDisplays').innerHTML = "";
		let name = groupSearchForm.querySelector('#groupName').value;
		if(name == ""){
				document.getElementById('allDisplays').innerHTML = "";
				return;
		}
		fetch('/group/name/' + name).then(response => {
				if(response.status === 200) {
						return response.json();
				} else {
						throw response;
				}
		}).then(groupArray => {
			console.log(groupArray);
			groups = groupArray;
			for(var i = 0; i < groupArray.length; i++){
					displayUser(groupArray[i]);
			}
		}).catch(error => {
				console.log(error)
		})


}

function displayUser(group){
	let markup = `
	<div id = "innerWrapper">
		<div id = "groupDisplay" class = "group-entry">
			<div id = "groupInfo">
				<p><b>Name:</b> ${group.name}</p>
				<p><b>Number of Members:</b> ${group.members.length}</p>
				<p hidden>${group._id}</p>
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
