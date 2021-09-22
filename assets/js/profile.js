// chama o serviço que devolve a informção já do utilizador
function getUser() {
        (async () => {
            const token = getCookie("login");
            await $.ajax({
                url: linkUrl + "/me/",
                type: "GET",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
                success: function (data) {
                    data = data.data;
                    document.getElementById('firstName').value = data.firstName;
                    document.getElementById('lastName').value = data.lastName;
                    document.getElementById('email').value = data.email;
                    document.getElementById('address').value = data.address;
                    document.getElementById('phone').value = data.phoneNumber;
                    if (data.subsectionId) {
                        getSection(data.subsection.section.id)
                        getSubSection(data.subsection.section.id, data.subsectionId);
                    } else {
                        getSection(0)
                        getSubSection(0,0);
                    }
                    if (data.cargoId) {
                        getCargo(data.cargoId);
                    } else getCargo(0)
                    document.getElementById('createdAt').value = data.createdAt.substr(0, 10);
                    document.getElementById('updatedAt').value = data.updatedAt.substr(0, 10);
                    if(data.roleId == 1){
                        document.getElementById('isAdmin').checked = true;
                    }else{
                        document.getElementById('isAdmin').checked = false;
                    }
                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire(
                        'Erro!',
                        msg.message,
                        'error'
                    );
                    exit = err;
                }
            })
        })();
}

// Função que guarda as alterações do utilizador
function saveuser() {
    let errForm = "";
    cargo = 1;
    role = 1;
    // validação do preenchimento dos campos
    if (document.getElementById("firstName").value == "") {
        errForm += "Nome próprio é obrigatório.<br>";
    }
    if (document.getElementById("lastName").value == "") {
        errForm += "Apelido é obrigatório.<br>";
    }
    if (document.getElementById("address").value == "") {
        errForm += "Morada é obrigatório.<br>";
    }
    if (document.getElementById("phone").value == "") {
        errForm += "Telemóvel é obrigatório.<br>";
    }
    if (document.getElementById("email").value == "") {
        errForm += "Email é obrigatório.<br>";
    }

    if (document.getElementById("cargoId").value == "") {
        errForm += "Cargo é obrigatório.<br>";
    }

    if (document.getElementById("subsectionId").value == "") {
        errForm += "Secção é obrigatório.<br>";
    }

    if (errForm != "") {
        Swal.fire({
            icon: "error",
            title: errForm,
            showConfirmButton: false,
            timer: 4500,
        });

    } else {
        // se passar na validação vai chamar o serviço e enviar a informação
        if (document.getElementById("isAdmin").checked) {
            isAdmin = 1;
        } else {
            isAdmin = 2;
        }
        let objUser = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            phoneNumber: document.getElementById("phone").value,
            subsectionId: document.getElementById("subsectionId").value,
            cargoId: document.getElementById("cargoId").value,
            roleId: isAdmin,
        };
        let exit = "no";
        const json = JSON.stringify(objUser);
        const token = getCookie("login");
        $.ajax({
            url: linkUrl + "/me" ,
            type: "PUT",
            data: json,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
            success: function (result) {
                Swal.fire({
                    icon: "success",
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1500,
                }).then(function () {
                    window.location = "/home.html";
                });

            },
            error: function (err) {
                msg = err;
                Swal.fire(
                    'Erro!',
                    msg.message,
                    'error'
                );
                exit = err;
            }
        });
    }
}

function getCargo(v_id) {
    (async () => {
        const token=getCookie('login')
        await $.ajax({
            url: linkUrl + "/cargo/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                select = document.getElementById('cargoId');
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        var opt = document.createElement('option')
                        opt.value = data[i].id;
                        opt.innerHTML = data[i].cargo;
                        if (data[i].id == v_id) {
                            opt.selected = 'selected';
                        }
                        select.appendChild(opt);

                    }

                }
            },
        })
    })();
}


function getSection(v_id) {
    (async () => {
        const token=getCookie('login')
        await $.ajax({
            url: linkUrl + "/section/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                select = document.getElementById('sectionId');
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        var opt = document.createElement('option')
                        opt.value = data[i].id;
                        opt.innerHTML = data[i].section;
                        if (data[i].id == v_id) {
                            opt.selected = 'selected';
                        }
                        select.appendChild(opt);

                    }

                }
            },
        })
    })();
}

function getSubSection(v_id, idSelect) {

    (async () => {
        const token=getCookie('login')
        $.ajax({
            url: linkUrl + "/section/" + v_id + "/subs",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                select = document.getElementById('subsectionId');
                select.options.length = 0;
                data = data.data;
                var opt = document.createElement('option')
                opt.value = '';
                opt.innerHTML = 'Grupo';
                select.appendChild(opt);
                for (i in data) {
                    opt = document.createElement('option')
                    opt.value = data[i].id;
                    opt.innerHTML = data[i].subsection;
                    if (data[i].id == idSelect) {
                        opt.selected = 'selected';
                    }
                    select.appendChild(opt);
                }

            }
        })
    })();
}

function resetPassword() {
    (async () => {
        const { value: form } = await Swal.fire({
            title: "Alterar Senha",
            showCancelButton: true,
            confirmButtonText: "Alterar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="categoryForm">' +
                '<p style="font-size: 50px">' +
                '<i class="bi bi-key"></i></p>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Senha atual</span>' +
                '<input type="password" id="apassword" class="form-control" maxlength="100" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Nova senha</span>' +
                '<input type="password" id="password" class="form-control" maxlength="100" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Repetir senha</span>' +
                '<input type="password" id="rpassword" class="form-control" min="0" max="9" required>' +
                '</div>' +
                '</div>',
            preConfirm: () => {
                let error_msg = "";
                if (!document.getElementById("apassword").value) {
                    error_msg += "Senha atual é obrigatória.<br>";
                } 
                if (!document.getElementById("password").value) {
                    error_msg += "Senha é obrigatória.<br>";
                } else {
                    if (!document.getElementById("rpassword").value) {
                        error_msg += "A confirmação é obrigatória.<br>";
                    } else {
                        if (document.getElementById("password").value != document.getElementById("rpassword").value) {
                            error_msg += "A senha e a confirmação são diferentes.<br>";
                        }
                    }
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("apassword").value,
                    document.getElementById("password").value,
                    document.getElementById("rpassword").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (form) {
            obj = {
                currentPwd: form[0],
                newPwd: form[1],
                confNewPwd: form[2]
            };
            const json = JSON.stringify(obj);
            const token=getCookie('login')
            $.ajax({
                url: linkUrl + "/me/pwd",
                type: "post",
                data: json,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
                success: function (result) {
                    msg = result.message;
                    Swal.fire({
                        icon: "success",
                        title: msg,
                        showConfirmButton: false,
                        timer: 1500,
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire(
                        'Erro!',
                        msg.message,
                        'error'
                    );
                    exit = err;
                }
            });

        }
    })();
}