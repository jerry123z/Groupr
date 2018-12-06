const classSearchForm = document.querySelector('#classSearchForm');
const editUserForm = document.querySelector('#allDisplays');

var groups = []

groupSearchForm.addEventListener('input', searchUser);
editUserForm.addEventListener('click', editUser);

function editUser(e){
	e.preventDefault();
	if(e.target.classList.contains('button')){
		info = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("p");
		console.log(info);
		name = info[0].textContent.split(":")[1].trim();

		let ind = groups.findIndex(o => o.name == name);
		console.log(name)
		window.location.href = "groupEdit.html?id=" + groups[ind]._id;
	}
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

function displayUser(group){
	let markup = `
	<div id = "innerWrapper">
		<div id = "groupDisplay" class = "group-entry">
			<div id = "groupInfo">
				<p><b>Name:</b> ${group.name}</p>
				<p><b>Number of Members:</b> ${group.members.length}</p>
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
