﻿function log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += msg + '\r\n';
    });
}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);


var config = {
    authority: "https://identityserverhostdev.webjet.com.au/",
    client_id: "CommissionGui",
    redirect_uri: "http://localhost:5003/callback.html",
    response_type: "code",
    scope: "CommissionGuiApi",
    post_logout_redirect_uri: "http://localhost:5003/index.html",
};
var mgr = new Oidc.UserManager(config);


mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile);
    }
    else {
        log("User not logged in");
    }
});

function login() {
    mgr.signinRedirect();
}

function api() {
    mgr.getUser().then(function (user) {
        var url = "https://localhost:44304/values";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        };
        if (user) {
            console.log(user.access_token);
            xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        }
        xhr.send();
    });
}

function logout() {
    mgr.signoutRedirect();
}