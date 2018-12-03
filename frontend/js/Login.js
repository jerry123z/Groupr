$('document').ready(function () {
    console.log($.urlParam('register'))
    if ($.urlParam('register')){
        document.getElementById("login-panel").style.display = "none";
    } else {
        document.getElementById("register-panel").style.display = "none";
    }
});

$('#login-form').submit(function (e) {
    e.preventDefault();
    //Check fields
    if ($('#Email').val().length == 0) {
        throw "Email is empty";
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

$('#register-form').submit(function (e) {
    e.preventDefault();
    //Check fields
    if ($('#EmailReg').val().length == 0) {
        throw "Email is empty";
    }
    else if ($('#PasswordReg').val().length == 0) {
        throw "Password is empty";
    }
});

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
}
