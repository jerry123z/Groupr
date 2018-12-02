$('document').ready(function () {
});

$('#login-form').submit(function (e) {
    e.preventDefault();
    //Check fields
    if ($('#Username').val().length == 0) {
        throw "Username is empty";
    }
    else if ($('#Password').val().length == 0) {
        throw "Password is empty";
    }

    if ($('#Username').val() === 'admin'){
        console.log("admin");
        window.location.replace("./findUser.html");
    } else{
        console.log("user");
        window.location.replace("./profile.html");
    }

});
