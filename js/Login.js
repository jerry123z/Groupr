$('document').ready(function () {
});

$('#login-form').submit(function (e) {
    //Check fields
    if ($('#UserName').val().length == 0) {
        alert("Username cannot be empty!");
        e.preventDefault();
    }
    else if ($('#Password').val().length == 0) {
        alert('Password cannot be empty!')
        e.preventDefault();
    }
    e.preventDefault();
});
