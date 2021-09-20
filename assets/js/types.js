
// Chama o serviço que devolve todos as categorias do utilizador
function getAllTypes() {
    let category = document.getElementById("category").value;
    (async () => {
        if (category == "") {
            searchUrl = "/item/type/all";
        } else {
            searchUrl = "/item/type/all?category=" + category;
        }
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + searchUrl,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
            success: function (data) {
                table = document.getElementById('AllCategory');
                data = data.data;
                if (data.length > 0) {
                    num = 0;
                    auxTable = '<table id="types" class="table table-hover align-middle">' +
                        '<tr class="d-flex">' +
                        '<th class="col-1 text-center">Código</th>' +
                        '<th class="col-8">Tipo</th>' +
                        '<th class="col-2">Categoria</th>' +
                        '<th class="col-1"></th>' +
                        '</tr>';
                    for (i in data) {
                        num += 1
                        auxTable += '<tr class="d-flex">' +
                            '<td class="col-1 text-center"> ' + data[i].fullCode + '</td>' +
                            '<td class="col-8"> ' + data[i].type + '</td>' +
                            '<td class="col-2"> ' + data[i].item_category.category + '</td>' +
                            '</div></td><td class="col-1 text-end"><div class="btn-group" role="group" aria-label="action">' +
                            '<a href="javascript:editType(' + data[i].id + ');" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-pencil-square"></i></button></a>' +
                            '<a href="javascript:delType(' + data[i].id + ');" title="Eliminar"><button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></a>' +
                            '</div></td>'
                        auxTable += '</tr>';

                    }
                    table.innerHTML = auxTable + '</table>';
                } else {
                    table.innerHTML = '<div width="100%" style="text-align:center">' +
                        '<h2>Category not Found.</h2>' +
                        '</div>';
                }
            },
            error: function (err) {
                document.getElementById('types').innerHTML = '<div class="alert alert-danger" role="alert">' +
                    err.responseJSON.message +
                    '</div>';
                exit = err;
            }
        })
    })();
}

function editType(v_id) {
    (async () => {
        let categoryId = "";
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + "/item/type/" + v_id,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                data = data.data;
                type = data.type;
                code = data.code;
                categoryId = data.categoryId;
            }
        })
        select = "";
        await $.ajax({
            url: linkUrl + "/item/category/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                select = '<select id="cat" class="form-select" disabled><option value="">Categoria</option>';
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        select += '<option value="' + data[i].id + '"';
                        if (data[i].id == categoryId) {
                            select += 'selected';
                        }
                        select += ' >' + data[i].category + '</option>';
                    }
                }
                select += '</select>'
            },
        })
        const form = await Swal.fire({
            title: "Editar tipo",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="typeForm">' +
                '<p style="font-size: 50px">' +
                '<i class="bi bi-pencil-square"></i></p>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Nome</span>' +
                '<input type="text" id="type" class="form-control" maxlength="100" value="' + type + '" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Código</span>' +
                '<input type="number" id="code" class="form-control" min="0" max="9" value="' + code + '" required>' +
                '<span class="input-group-text">Categoria</span>' +
                select +
                '</div>' +
                '</div>',

            preConfirm: () => {
                let error_msg = "";
                if (!document.getElementById("type").value) {
                    error_msg += "O nome do tipo não pode ficar em branco.<br>";
                }
                if (!document.getElementById("code").value) {
                    error_msg += "O código não pode ficar em branco.<br>";
                }
                if (!document.getElementById("cat").value) {
                    alert(document.getElementById("cat").value);
                    error_msg += "Tem de escolher uma categoria.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("type").value,
                    document.getElementById("code").value,
                    document.getElementById("cat").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (form) {
            objCategory = {
                type: form[0],
                code: form[1],
                categoryId: form[2],
            };
            console.log(objCategory);
            const json = JSON.stringify(objCategory);
            $.ajax({
                url: linkUrl + "/item/type/" + v_id,
                type: "PUT",
                data: json,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    //document.cookie = "userId=" + result;
                    Swal.fire({
                        icon: "success",
                        title: result.message,
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        getAllTypes();
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire(
                        'Erro!',
                        msg.message,
                        'error'
                    ).then(function () {
                        getAllTypes();
                    });
                    exit = err;
                }
            });

        }
    })();
}

function createType() {
    (async () => {
        const token = getCookie('login')
        let select = "";
        await $.ajax({
            url: linkUrl + "/item/category/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                select = '<select id="cat" class="form-select"><option value="">Categoria</option>';
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        select += '<option value="' + data[i].id + '"';
                        select += ' >' + data[i].category + '</option>';
                    }
                }
                select += '</select>'
            },
        })
        const form = await Swal.fire({
            title: "Tipo de material",
            showCancelButton: true,
            confirmButtonText: "Criar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="typeForm">' +
                '<p style="font-size: 50px">' +
                '<i class="bi bi-pencil-square"></i></p>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Nome</span>' +
                '<input type="text" id="type" class="form-control" maxlength="100" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Código</span>' +
                '<input type="number" id="code" class="form-control" min="0" max="9" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Categoria</span>' +
                select +
                '</div>' +
                '</div>',
            preConfirm: () => {
                let error_msg = "";
                if (!document.getElementById("type").value) {
                    error_msg += "O nome do tipo não pode ficar em branco.<br>";
                }
                if (!document.getElementById("code").value) {
                    error_msg += "O código não pode ficar em branco.<br>";
                }
                if (!document.getElementById("cat").value) {
                    error_msg += "Tem de escolher uma categoria.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("type").value,
                    document.getElementById("code").value,
                    document.getElementById("cat").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (form) {
            objCategory = {
                type: form[0],
                code: form[1],
                categoryId: form[2],
            };
            const json = JSON.stringify(objCategory);
            $.ajax({
                url: linkUrl + "/item/type/new",
                type: "POST",
                data: json,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire({
                        icon: "success",
                        title: result.message,
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        getAllTypes();
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire(
                        'Erro!',
                        msg.message,
                        'error'
                    ).then(function () {
                        getAllCategorys();
                    });
                    exit = err;
                }
            });

        }
    })();
}

function delType(v_id) {
    (async () => {
        const token = getCookie('login')
        const form = await Swal.fire({
            title: 'Tem a certeza?',
            text: "Esta acção é irreversível!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sim, eliminar'
        })

        if (form) {
            $.ajax({
                url: linkUrl + "/item/type/" + v_id,
                type: "DELETE",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire(
                        'Eliminado.',
                        result.message,
                        'success'
                    ).then(function () {
                        getAllTypes();
                    });

                },
                error: function (err) {
                    alert(err.statusText);
                    exit = err;
                }
            });
        }
    })();
}


function getCategory() {
    (async () => {
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + "/item/category/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
            success: function (data) {
                msg = data.message
                select = document.getElementById('category');
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        var opt = document.createElement('option')
                        opt.value = data[i].id;
                        opt.innerHTML = data[i].category;
                        select.appendChild(opt);
                    }
                }
            },
        })
    })();
}

function changeCategory() {
    getAllTypes();
}