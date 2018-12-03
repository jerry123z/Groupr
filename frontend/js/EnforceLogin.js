
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
        if(!json) {
            window.location.replace("./login.html");
            return;
        }
        $(document).trigger("loggedin", [json]);
    }).catch(error => {
        console.error(error);
    });
});
