async function getAllUsers() {
    const subsection = document.getElementById('subsection').value
    let searchUrl
    if (subsection !== '') searchUrl = '/user/all?subsection=' + subsection
    else searchUrl = '/user/all'
    const token = getCookie('login')
    let table = document.getElementById('AllUsers')
    $.ajax({
        url: linkUrl + searchUrl,
        type: 'GET',
        beforeSend: function (xhr) {xhr.setRequestHeader('x-access-token', token)},
        success: function (res) {
            console.log(res)
            const data = res.data
            const msg = res.data.message
            let renderTable
            if (data.length > 0) {
                renderTable =
                    '<table id="users" class="table table-hover align-middle">'+
                    '<thead><tr class="d-flex">' +
                    '<th class="col-2">Nome</th>' +
                    '<th class="col-2">Email</th>' +
                    '<th class="col-3">Morada</th>' +
                    '<th class="col-2">Nº telemóvel</th>' +
                    '<th class="col-1">Cargo</th>' +
                    '<th class="col-1">Grupo</th>' +
                    '<th class="col-1"></th>' +
                    '</tr></thead>'+
                    '<tbody>'
                for (i in data) {
                    let cargo, subsection
                    data[i].cargo ? cargo = data[i].cargo.cargo : cargo = '<i>Sem cargo</i>'
                    data[i].subsection ? subsection = data[i].subsection.subsection : subsection = '<i>Sem grupo</i>'
                    renderTable += 
                        '<tr class="d-flex fs-7">'+
                        '<td class="col-2">' + data[i].firstName + ' ' + data[i].lastName + '</td>' +
                        '<td class="col-2">' + data[i].email + '</td>' +
                        '<td class="col-3"> ' + data[i].address + '</td>' +
                        '<td class="col-2"> ' + data[i].phoneNumber + '</td>' +
                        '<td class="col-1"> ' + cargo + '</td>' +
                        '<td class="col-1"> ' + subsection + '</td>' +
                        '<td class="col-1 text-end"><div class="btn-group" role="group" aria-label="action">' +
                        '<a href="javascript:editUser(' + data[i].id + ')" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil-square"></i></button></a>' +
                        '<a href="javascript:delUser(' + data[i].id + ')" title="Eliminar"><button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></a>' +
                        '</div></td>'
                        '</tr>'
                }
                renderTable += '</tbody></table>'
                table.innerHTML = renderTable
            } else {
                table.innerHTML = 
                '<div class="alert alert-danger" role="alert">'+
                msg +
                '</div>'
            }
        },
        error: function (err) {
            msg = JSON.parse(err.responseText);
            table.innerHTML = 
            '<div class="alert alert-danger" role="alert">'+
            msg.message +
            '</div>'
        }
    })
}

function editUser(v_id) {
    document.cookie = "userId=" + v_id;
    window.location = "user.html";
}

function createUser(v_id) {
    document.cookie = "userId=";
    window.location = "user.html";
}

async function delUser(id) {
    const delUser = await Swal.fire({
        title: 'Tem a certeza?',
        text: "Esta acção é irreversível!",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        
    })
    if (delUser.isConfirmed) {
        const token = getCookie('login')
        $.ajax({
            url: linkUrl + '/user/' + id,
            type: 'DELETE',
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (res) {
                Swal.fire({
                    icon: "success",
                    title: res.message,
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    getAllUsers()
                })
            },
            error: function (err) {
                Swal.fire({
                    icon: 'error',
                    title: res.message,
                    showConfirmButton: true,
                    confirmButtonText: 'Fechar',
                    showCloseButton: true,
                })
            }
        })
    }
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
