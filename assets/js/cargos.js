
// Chama o serviço que devolve todos as categorias do utilizador
function getAllCargos() {
    (async () => {
        let token = getCookie("login");
        await $.ajax({
            url: linkUrl + "/cargo/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
            success: function (data) {
                table = document.getElementById('AllCargo');
                msg = data.message;
                data = data.data;
                if (data.length > 0) {
                    num = 0;
                    auxTable = '<table class="table table-hover align-middle" id="sections">' +
                        '<tr class="d-flex">' +
                        '<th class="col-11">Cargo</th>' +
                        '<th class="col-1"></th>' +
                        '</tr>';
                    for (i in data) {
                        num += 1
                        auxTable += '<tr class="d-flex">' +
                            '<td class="col-11">' + data[i].cargo + '</td>' +
                            '</div></td><td class="col-1 text-center"><div class="btn-group" role="group" aria-label="action">' +
                            '<a href="javascript:editCargo(' + data[i].id + ');" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-pencil-square"></i></button></a>' +
                            '<a href="javascript:delCargo(' + data[i].id + ');" title="Eliminar"><button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></a>' +
                            '</div></td>'
                        auxTable += '</tr>';
                    }
                    table.innerHTML = auxTable + '</table>';
                } else {
                    table.innerHTML = '<div width="100%" style="text-align:center">' +
                        '<h2>' + msg + '</h2>' +
                        '</div>';
                }
            },
        })
    })();

}

function editCargo(v_id) {
    (async () => {
        const token = getCookie("login");
        await $.ajax({
            url: linkUrl + "/cargo/" + v_id,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
            success: function (data) {
                data = data.data;
                cargo = data.cargo;
            }
        })
        const { value: cargoForm } = await Swal.fire({
            title: "Editar cargo",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            confirmButtonColor: '#212529',
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="cargoForm" >' +
                '<p style="font-size: 50px">' +
                '<i class="bi bi-pencil-square"></i></p>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Cargo</span>' +
                '<input type="text" id="cargo" class="form-control" maxlength="100" value="' + cargo + '" required>' +
                '</div>' +
                '</div>',
            preConfirm: () => {
                let errorMsg = ''
                if (!document.getElementById('cargo').value) {
                    errorMsg += '"Cargo" é um campo obrigatório.<br>'
                }
                if (errorMsg) Swal.showValidationMessage(errorMsg)
                return [
                    document.getElementById("cargo").value,
                ]
            },
        });
        if (cargoForm) {
            objCargo = {
                cargo: cargoForm[0],
            };
            let json = JSON.stringify(objCargo);
            $.ajax({
                url: linkUrl + "/cargo/" + v_id,
                type: "PUT",
                data: json,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
                success: function (result) {
                    getAllCargos();
                    Swal.fire({
                        icon: "success",
                        title: result.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message
                    }).then(function () {
                        getAllCargos();
                    });
                    exit = err;
                }
            });

        }
    })();
}


function createCargo(v_id) {
    (async () => {
        let token = getCookie("login");
        const { value: cargoForm } = await Swal.fire({
            title: "Novo cargo",
            showCancelButton: true,
            confirmButtonText: "Criar",
            confirmButtonColor: '#212529',
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                ' <form id="cargoForm" >' +
                '<p style="font-size: 50px">' +
                '<i class="bi bi-pencil-square"></i></p>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Cargo</span>' +
                '<input type="text" id="cargo" class="form-control" maxlength="100" required>' +
                '</div>' +
                '</div>',
            preConfirm: () => {
                let errorMsg = ''
                if (!document.getElementById('cargo').value) {
                    errorMsg += '"Cargo" é um campo obrigatório.<br>'
                }
                if (errorMsg) Swal.showValidationMessage(errorMsg)
                return [
                    document.getElementById("cargo").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (cargoForm) {
            objCargo = {
                cargo: cargoForm[0],
            };
            let json = JSON.stringify(objCargo);
            $.ajax({
                url: linkUrl + "/cargo/new",
                type: "POST",
                data: json,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
                success: function (result) {
                    getAllCargos();
                    Swal.fire({
                        icon: "success",
                        title: result.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message,
                        confirmButtonColor: '#212529',
                    }).then(function () {
                        getAllSections();
                    });
                    exit = err;
                }
            });

        }
    })();
}

function delCargo(v_id) {
    (async () => {
        var category = "";
        const { value: formCargo } = await Swal.fire({
            title: 'Tem a certeza?',
            text: "Esta acção é irreversível.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#d33',
            cancelButtonText: "Cancelar",
        });
        if (formCargo){
            const token = getCookie('login')
            $.ajax({
                url: linkUrl + "/cargo/" + v_id,
                type: "DELETE",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token) },
                success: function (result) {
                    Swal.fire({                        
                        icon: 'success',
                        title: result.message,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(function () {
                        getAllCargos();
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message
                    })
                    exit = err;
                }
            });
        }
    })();
}