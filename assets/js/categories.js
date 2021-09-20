
// Chama o serviço que devolve todos as categorias do utilizador
function getAllCategorys() {
    (async () => {
        const token=getCookie("login")
        await $.ajax({
            url: linkUrl + "/item/category/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                table = document.getElementById('AllCategory');
                data = data.data;
                if (data.length > 0) {
                    num = 0;
                    auxTable = '<table id="categories" class="table table-hover text-wrap align-middle">' +
                        '<tr class="d-flex">' +
                        '<th class="col-1 text-center">Código</th>' +
                        '<th class="col-9">Categoria</th>' +
                        '<th class="col-1"></th>' +
                        '<th class="col-1"></th>' +
                        '</tr>';
                    for (i in data) {
                        num += 1
                        auxTable += '<tr class="d-flex">' +
                            '<td class="col-1 text-center"> ' + data[i].code + '</td>' +
                            '<td class="col-9">' + data[i].category + '</td>' +
                            '<td class="col-1 text-end"><button type="button" title="Ver tipos" class="btn btn-sm btn-outline-info"><i class="bi bi-list"></i></button></td>' +
                            '</div></td><td class="col-1 text-end"><div class="btn-group" role="group" aria-label="action">' +
                            '<a href="javascript:editCategory(' + data[i].id + ');" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-pencil-square"></i></button></a>' +
                            '<a href="javascript:delCategory(' + data[i].id + ');" title="Eliminar"><button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></a>' +
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


        })
    })();

}

function editCategory(v_id) {
    (async () => {
        const token=getCookie("login")
        let category = '';
        await $.ajax({
            url: linkUrl + "/item/category/" + v_id,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                data = data.data;
                category = data.category;
                code = data.code
            }
        })
        const { value: form } = await Swal.fire({
            title: "Editar categoria",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="categoryForm">' +
                '<p style="font-size: 50px">' +
                '<i class="bi bi-pencil-square"></i></p>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Nome</span>' +
                '<input type="text" id="category" class="form-control" maxlength="100" value="' + category + '" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Código</span>' +
                '<input type="number" id="code" class="form-control" min="0" max="9" value="' + code + '" required>' +
                '</div>' +
                '</div>',
            preConfirm: () => {
                let error_msg = "";
                if (!document.getElementById("category").value) {
                    error_msg += "O nome da categoria não pode ficar em branco.<br>";
                }
                if (!document.getElementById("code").value) {
                    error_msg += "O código da categoria não pode ficar em branco.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("category").value,
                    document.getElementById("code").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (form) {
            objCategory = {
                category: form[0],
                code: form[1]
            };
            const json = JSON.stringify(objCategory);
            const token=getCookie("login")
            $.ajax({
                url: linkUrl + "/item/category/" + v_id,
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
                        getAllCategorys();
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

function createCategory() {
    (async () => {
        var category = "";
        const { value: form } = await Swal.fire({
            title: "Category",
            showCancelButton: true,
            confirmButtonText: "Create",
            cancelButtonText: "Cancel",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="categoryForm">' +
                '<p style="font-size: 50px">' +
                '<i class="bi bi-pencil-square"></i></p>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Nome</span>' +
                '<input type="text" id="category" class="form-control" maxlength="100" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Código</span>' +
                '<input type="number" id="code" class="form-control" min="0" max="9" required>' +
                '</div>' +
                '</div>',
            preConfirm: () => {
                let error_msg = "";
                if (!document.getElementById("category").value) {
                    error_msg += "O nome da categoria não pode ficar em branco.<br>";
                }
                if (!document.getElementById("code").value) {
                    error_msg += "O código da categoria não pode ficar em branco.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("category").value,
                    document.getElementById("code").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (form) {
            objCategory = {
                category: form[0],
                code: form[1]
            };
            const json = JSON.stringify(objCategory);
            const token=getCookie("login")
            $.ajax({
                url: linkUrl + "/item/category/new",
                type: "POST",
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
                        getAllCategorys();
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

function delCategory(v_id) {
    (async () => {
        var category = "";
        const { value: form } = await Swal.fire({
            title: 'Tem a certeza?',
            text: "Esta acção é irreversível!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sim, eliminar'
        });
        if (form) {
            $.ajax({
                url: linkUrl + "/item/category/" + v_id,
                type: "DELETE",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire(
                        'Eliminado.',
                        result.message,
                        'success'
                    ).then(function () {
                        getAllCategorys();
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