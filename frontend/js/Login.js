
// I got this from: https://emailregex.com/
const email_regex = /[A-Za-z0-9\._]+@[A-Za-z0-9\._]+/;

function create_signup_schools(schools) {
    schools.forEach(school => {
        $("#signup-school").append($("<option></option>").val(school._id).text(school.name));
    });
}

$('document').ready(function () {

    fetch('/login', {
        method: "GET"
    }).then((response) => {
        if(response.status === 200) {
            return response.json();
        } else {
            return new Promise(resolve => {
                resolve(null);
            });
        }
    }).then((json) => {
        if(json && json.isAdmin == false) {
            window.location.replace("./profile.html?user=" + json._id);
            return null;
        } else if(json && json.isAdmin == true) {
            window.location.replace("./findGroup.html");
            return null;
        }
        return fetch('/school', {
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        });
    }).then((response) => {
        if(response.status === 200) {
            return response.json();
        } else {
            throw response;
        }
    }).then(json => {
        create_signup_schools(json);
    }).catch(error => {
        console.error(error);
    });

    $('#signup-block').hide();
    $('#switch-login').click(() => {
        $('#signup-block').hide();
        $('#login-block').show();
    });
    $('#switch-signup').click(() => {
        $('#signup-block').show();
        $('#login-block').hide();
    });

});

$('#login-form').submit(function (e) {
    e.preventDefault();
    //Check fields
    const email = $('#login-email').val();
    const password = $('#login-password').val();
    if (!email_regex.test(email)) {
        throw "Email is invalid";
    }
    else if (password.length == 0) {
        throw "Password is empty";
    }

    fetch('/login', {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ email, password })
    }).then((response) => {
        if(response.status === 200) {
            return response.json();
        } else {
            throw response;
        }
    }).then(json => {
        if (json.isAdmin == false){
            window.location.replace("./profile.html?user=" + json._id);
        } else {
            window.location.replace("./findGroup.html");
        }
    }).catch(error => {
        console.log(error);
    });
});

$('#signup-form').submit(function (e) {
    e.preventDefault();
    //Check fields
    const email = $('#signup-email').val();
    const password = $('#signup-password').val();
    const name = $('#signup-name').val();
    const school = $('#signup-school').val();
    if (!email_regex.test(email)) {
        throw "Email is invalid";
    }
    else if (password.length == 0) {
        throw "Password is empty";
    }
    else if (name.length == 0) {
        throw "Name is empty";
    }

    fetch('/user', {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ email, password, name, school })
    }).then((response) => {
        if(response.status === 200) {
            return response.json();
        } else {
            throw response.text();
        }
    }).then(json => {
        window.location.replace("./profile.html?user=" + json._id);
    }).catch(error => {
        console.log(error);
    });
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
