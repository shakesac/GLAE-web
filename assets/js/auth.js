function login() {
    var errForm = "";
    if (document.getElementById("email").value == "") {
        errForm += "O email é obrigatório.<br>";
    }
    if (document.getElementById("password").value == "") {
        errForm += "Senha é obrigatória.<br>";
    }
    if (errForm != "") {
        Swal.fire({
            icon: "error",
            title: errForm,
            showConfirmButton: true,
            timer: 1500,
        });

    } else {
        (async () => {
            objLogin = {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            };
            const json = JSON.stringify(objLogin);
            await $.ajax({
                url: linkUrl + "/login",
                type: "post",
                data: json,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    //document.cookie = "userId=" + result;
                    Swal.fire({
                        icon: "success",
                        title: "Login OK.",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        document.cookie = "login=" + result.data.token;
                        if (result.data.user.roleId == 1) {
                            window.location = "home.html";
                        }
                        else {
                            window.location = "/users/leases.html";
                        }
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        title: 'Erro!',
                        html: msg.message,
                        icon: 'error',
                        timer: 1500,
                    }
                    );
                    exit = err;
                }
            });
        })();
    }
}

function register() {
    var errForm = "";
    if (document.getElementById("firstName").value == "") {
        errForm += "O Nome é obrigatório.<br>";
    }
    if (document.getElementById("lastName").value == "") {
        errForm += "O Apeliddo é obrigatório.<br>";
    }
    if (document.getElementById("address").value == "") {
        errForm += "A Morada é obrigatória.<br>";
    }
    if (document.getElementById("phoneNumber").value == "") {
        errForm += "O Número de telemóvel é obrigatório.<br>";
    }
    if (document.getElementById("sectionId").value == "") {
        errForm += "A Secção é obrigatória.<br>";
    }
    if (document.getElementById("subsectionId").value == "") {
        errForm += "O Grupo é obrigatório.<br>";
    }
    if (document.getElementById("email").value == "") {
        errForm += "O Email é obrigatório.<br>";
    }
    if (document.getElementById("password").value == "") {
        errForm += "A Senha é obrigatória.<br>";
    } else {
        if (document.getElementById("confirmPassword").value == "") {
            errForm += "Precisa de confirmar a senha.<br>";
        } else {
            if (document.getElementById("password").value != document.getElementById("confirmPassword").value) {
                errForm += "A confirmação não é igual a senha.<br>";
            }
        }
    }
    if (errForm != "") {
        Swal.fire({
            icon: "error",
            title: errForm,
            showConfirmButton: false,
            timer: 4500,
        });

    } else {
        (async () => {
            objLogin = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("email").value,
                address: document.getElementById("address").value,
                phoneNumber: document.getElementById("phoneNumber").value,
                password: document.getElementById("password").value,
                confirmPassword: document.getElementById("confirmPassword").value,
                subsectionId: document.getElementById("subsectionId").value,
            };
            const json = JSON.stringify(objLogin);
            await $.ajax({
                url: linkUrl + "/register",
                type: "post",
                data: json,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    Swal.fire({
                        icon: "success",
                        title: result.message,
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        window.location = "login.html";
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire(
                        'Erro!',
                        msg.message,
                        'error',
                        1500,
                    );
                    exit = err;
                }
            });
        })();
    }
}