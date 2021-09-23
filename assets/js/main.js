var linkUrl = "http://127.0.0.1:5000/api/v1";
haveLogin();

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function haveLogin() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if ((page != 'login.html') && (page != 'signup.html')) {
        (async () => {
            let token = getCookie("login");
            await $.ajax({
                url: linkUrl + "/me",
                type: "get",
                dataType: "json",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
                success: function (result) {
                    if ((result.data.roleId != 1) && (path.split("/")[1] == 'admin')) {
                        window.location = "/users/leases.html"
                    }
                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message,
                        confirmButtonColor: '#212529',
                        timer: 1500
                    }).then(function () {
                        window.location = "/login.html";
                    });
                    $(".swal2-container").css('background-color', '#000');
                    exit = err;
                }
            });
        })();
    }
}

function removeArray(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}