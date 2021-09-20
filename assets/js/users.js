
// Chama o serviço que devolve todos os teste de um utilizador e mostra numa tabela
function getAllUsers() {
    let subsection = document.getElementById("subsection").value;
    (async () => {
        if (subsection == "") {
            searchUrl = "/user/all";
        } else {
            searchUrl = "/user/all?subsection=" + subsection;
        }
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl +searchUrl,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                table = document.getElementById('AllUsers');
                data = data.data;
                if (data.length > 0) {
                    num = 0;
                    auxTable = '<table id="users" class="table table-hover align-middle">' +
                        '<thead><tr class="d-flex">' +
                        '<th class="col-2">Nome</th>' +
                        '<th class="col-2">Email</th>' +
                        '<th class="col-3">Morada</th>' +
                        '<th class="col-2">Nº telemóvel</th>' +
                        '<th class="col-1">Cargo</th>' +
                        '<th class="col-1">Grupo</th>' +
                        /*'<th class="col-1"></th>' +*/
                        '<th class="col-1"></th>' +
                        '</tr></thead>';
                    for (i in data) {
                        num += 1
                        if (data[i].cargo) {
                            cargo = data[i].cargo.cargo;
                        } else {
                            cargo = "Sem cargo";
                        }
                        if (data[i].subsection) {
                            subsection = data[i].subsection.subsection;
                        } else {
                            subsection = "Sem Grupo";
                        }
                        auxTable += '<tbody><tr class="d-flex fs-7">' +
                            '<td class="col-2">' + data[i].firstName + ' ' + data[i].lastName + '</td>' +
                            '<td class="col-2">' + data[i].email + '</td>' +
                            '<td class="col-3"> ' + data[i].address + '</td>' +
                            '<td class="col-2"> ' + data[i].phoneNumber + '</td>' +
                            '<td class="col-1"> ' + cargo + '</td>' +
                            '<td class="col-1"> ' + subsection + '</td>' +
                            /*
                            '<td class="col-1 text-end"><div class="btn-group" role="group" aria-label="action">' +
                            '<a href="javascript:editUser(' + data[i].id + ');" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil-square"></i></button></a>' +
                            '<a href="javascript:delUser(' + data[i].id + ');" title="Eliminar"><button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></a>' +
                            '</div></td>' +*/
                            '<td class="col-1 text-end"><div class="btn-group" role="group" aria-label="action">' +
                            '<a href="javascript:editUser(' + data[i].id + ');" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil-square"></i></button></a>' +
                            '<a href="javascript:delUser(' + data[i].id + ');" title="Eliminar"><button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></a>' +
                            '</div></td>'
                        auxTable += '</tr></tbody>';
                        console.log(data)

                    }
                    table.innerHTML = auxTable + '</table>';
                } else {
                    table.innerHTML = '<div class="alert alert-danger" role="alert">' +
                        'Não existem utilizadores.' +
                        '</div>';
                }

            },


        })
    })();

}

function editUser(v_id) {
    document.cookie = "userId=" + v_id;
    window.location = "user.html";
}

function createUser(v_id) {
    document.cookie = "userId=";
    window.location = "user.html";
}


function getSubSections() {
    (async () => {
        const token=getCookie("login")
        await $.ajax({
            url: linkUrl + "/subsection/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                select = document.getElementById('subsection');
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        var opt = document.createElement('option')
                        opt.value = data[i].id;
                        opt.innerHTML = data[i].subsection;
                        select.appendChild(opt);
                    }
                }
            },
        })
    })();
}

function changeSubsection() {
    getAllUsers();
}
