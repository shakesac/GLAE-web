
function getCategory() {
    (async () => {
        await $.ajax({
            url: linkUrl + "/item/category/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
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


// Chama o serviço que devolve todos os teste de um utilizador e mostra numa tabela
function getAllItens() {
    let category = document.getElementById("category").value;
    (async () => {
        if (category == "") {
            searchUrl = "/item/all";
        } else {
            searchUrl = "/item/all?category=" + category;
        }
        token = getCookie("login");
        await $.ajax({
            url: linkUrl + searchUrl,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
            success: function (data) {
                msg = data.message
                table = document.getElementById('AllItens');
                data = data.data;
                if (data.length > 0) {
                    auxTable = '<table class="table table-hover align-middle" id="itens">' +
                        '<tr class="d-flex">' +
                        '<th class="col-2">Nome</th>' +
                        '<th class="col-4">Descrição</th>' +
                        '<th class="col-2">Aquisição</th>' +
                        '<th class="col-2">Tipo</th>' +
                        '<th class="col-1 text-center">Inspecções</th>' +
                        '<th class="col-1"></th>' +
                        '</tr>';
                    for (i in data) {
                        auxTable += '<tr class="d-flex">' +
                            '<td class="col-2">' + data[i].name + '</td>' +
                            '<td class="col-4">' + data[i].description + '</td>' +
                            '<td class="col-2"> ' + data[i].purchasedAt + '</td>';
                        auxTable += '<td class="col-2"> ' + data[i].item_type.type + '</td>' +
                            '<td class="col-1 text-end"><div class="btn-group" role="group" aria-label="inspection">' +
                            '<a href="javascript:newInspection(' + data[i].id + ');" title="Nova inspecção"><button type="button" class="btn btn-sm btn-outline-info me-1"><i class="bi bi-file-earmark-plus"></i></button></a>' +
                            '<a href="javascript:viewInspection(' + data[i].id + ');" title="Ver inspecções"><button type="button" class="btn btn-sm btn-outline-info"><i class="bi bi-file-text"></i></button></a>' +
                            '</div></td><td class="col-1 text-end"><div class="btn-group" role="group" aria-label="action">' +
                            '<a href="javascript:editItem(' + data[i].id + ');" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-pencil-square"></i></button></a>' +
                            '<a href="javascript:delItem(' + data[i].id + ');" title="Eliminar"><button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></a>' +
                            '</div></td>'
                        auxTable += '</tr>';
                    }
                    table.innerHTML = auxTable + '</table>';
                } else {
                    table.innerHTML = '<div class="alert alert-danger" role="alert">' +
                        'Não existem utilizadores.' +
                        '</div>';
                }

            },
            error: function (err) {
                document.getElementById('AllItens').innerHTML = '<div class="alert alert-danger" role="alert">' +
                    err.responseJSON.message +
                    '</div>';
                exit = err;
            }


        })
    })();

}

function getItemTypes(v_id) {

    (async () => {
        $.ajax({
            url: linkUrl + "/item/category/" + v_id + "/types",
            type: "GET",
            success: function (data) {
                selectType = document.getElementById('type');
                selectType.options.length = 0;
                data = data.data;
                var opt = document.createElement('option')
                opt.value = '';
                opt.innerHTML = '';
                selectType.appendChild(opt);
                for (i in data) {
                    opt = document.createElement('option')
                    opt.value = data[i].id;
                    opt.innerHTML = data[i].type;
                    selectType.appendChild(opt);
                }

            }
        })
    })();
}

function editItem(v_id) {
    let typeId = "";
    var name = "";
    var description = "";
    var purchasedAt = "";
    $.ajax({
        url: linkUrl + "/item/" + v_id,
        type: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
        success: function (data) {
            data = data.data;
            name = data.name;
            description = data.description;
            purchasedAt = data.purchasedAt;
            createdAt = data.createdAt;
            typeId = data.typeId;
            categoryId = data.item_type.item_category.id;


            select = "";
            (async () => {
                await $.ajax({
                    url: linkUrl + "/item/category/all",
                    type: "GET",
                    beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                    success: function (data) {
                        msg = data.message
                        select = '<select id="category" class="form-select" onChange="getItemTypes(this.value);">' +
                            '<option value=""></option>';
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
                let select2 = '';
                const token=getCookie("login")
                await $.ajax({
                    url: linkUrl + "/item/category/" + categoryId + "/types",
                    type: "GET",
                    beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                    success: function (data) {
                        msg = data.message
                        select2 = '<select id="type" class="form-select"><option value=""></option>';
                        data = data.data;
                        if (data.length > 0) {
                            for (i in data) {
                                select2 += '<option value="' + data[i].id + '"';
                                if (data[i].id == typeId) {
                                    select2 += 'selected';
                                }
                                select2 += ' >' + data[i].type + '</option>';
                            }
                        }
                        select2 += '</select>'
                    },
                })


                const { value: formLogin } = await Swal.fire({
                    title: "Item",
                    showCancelButton: true,
                    confirmButtonText: "Guardar",
                    cancelButtonText: "Cancelar",
                    showLoaderOnConfirm: true,
                    allowOutsideClick: true,
                    allowEnterKey: true,
                    html:
                        '<form id="itemForm">' +
                        '<div class="imgcontainer">' +
                        '<i class="bi bi-pencil-square"></i></div><br>' +
                        '<div class="container">' +
                        '<div class="input-group input-group-sm mb-3">' +
                        '<span class="input-group-text">Nome</span>' +
                        '<input type="text" id="name" "class="form-control" value="' + name + '" maxlength="100" required>' +
                        '</div>' +
                        '<div class="input-group input-group-sm mb-3">' +
                        '<span class="input-group-text">Descrição</span>' +
                        '<textarea id="description" class="form-control" maxlength="1000">' + description + '</textarea>' +
                        '</div>' +
                        '<div class="input-group input-group-sm mb-3">' +
                        '<span class="input-group-text">Aquisição</span>' +
                        '<input type="date" id="purchasedAt" class="form-control" value="' + purchasedAt + '" required>' +
                        '</div>' +
                        '<div class="input-group input-group-sm mb-3">' +
                        '<label class="input-group-text" for="category">Categoria</label>' +
                        select +
                        '</div>' +
                        '<div class="input-group input-group-sm mb-3">' +
                        '<label class="input-group-text" for="type">Tipo</label>' +
                        select2 +
                        '</div>' +
                        '</div></form>',
                    preConfirm: () => {
                        var error_msg = "";
                        if (!document.getElementById("name").value) {
                            error_msg += "Nome é um campo obrigatório.<br>";
                        }
                        if (!document.getElementById("description").value) {
                            error_msg += "Descrição é um campo obrigatório.<br>";
                        }
                        if (!document.getElementById("purchasedAt").value) {
                            error_msg += "Comprado a é um campo obrigatório.<br>";
                        }
                        if (!document.getElementById("type").value) {
                            error_msg += "Tipo é um campo obrigatório.<br>";
                        }
                        if (error_msg) {
                            Swal.showValidationMessage(error_msg);
                        }
                        return [
                            document.getElementById("name").value,
                            document.getElementById("description").value,
                            document.getElementById("purchasedAt").value,
                            document.getElementById("type").value
                        ];
                    },
                });
                // se não tem erros no preenchimento chama o serviço de validação
                if (formLogin) {
                    objItem = {
                        name: formLogin[0],
                        description: formLogin[1],
                        purchasedAt: formLogin[2],
                        typeId: formLogin[3],


                    };
                    const json = JSON.stringify(objItem);
                    const token=getCookie('login')
                    $.ajax({
                        url: linkUrl + "/item/" + v_id,
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
                                getAllItens();
                            });

                        },
                        error: function (err) {
                            exit = err;
                        }
                    });

                }

            })();

        }
    })
}

function delItem(v_id) {
    (async () => {
        const { value: form } = await Swal.fire({
            title: 'Tem a certeza?',
            text: "Esta operação não é reversivél!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, eliminar!'
        });
        const token=getCookie('login')
        if (form) {
            $.ajax({
                url: linkUrl + "/item/" + v_id,
                type: "DELETE",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire(
                        'Eliminar!',
                        'Material eliminado com sucesso.',
                        'success'
                    ).then(function () {
                        getAllItens();
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire(
                        'Erro!',
                        msg.message,
                        'error'
                    ).then(function () {
                        getAllItens();
                    });
                    exit = err;
                }
            });
        }
    })();
}

function createItem() {
    let select = '';
    (async () => {
        const token=getCookie('login')
        await $.ajax({
            url: linkUrl + "/item/category/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                select = '<select id="category" class="form-select" onChange="getItemTypes(this.value);">' +
                    '<option value=""></option>';
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

        const { value: formLogin } = await Swal.fire({
            title: "Item",
            showCancelButton: true,
            confirmButtonText: "Criar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="itemForm" >' +
                '<div class="imgcontainer">' +
                '<i class="bi bi-pencil-square"></i></div><br><br>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Nome</span>' +
                '<input type="text" id="name" class="form-control" maxlength="100" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Descrição</span>' +
                '<textarea id="description" class="form-control" maxlength="1000"></textarea>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Aquisição</span>' +
                '<input type="date" id="purchasedAt" class="form-control" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<label class="input-group-text" for="category">Categoria</label>' +
                select +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<label class="input-group-text" for="type">Tipo</label>' +
                '<select id="type" class="form-select">' +
                '<option value=""></option>' +
                '</select>' +
                '</div>' +
                '</div></form>',

            preConfirm: () => {
                let error_msg = "";
                if (!document.getElementById("name").value) {
                    error_msg += "Nome é um campo obrigatório.<br>";
                }
                if (!document.getElementById("description").value) {
                    error_msg += "Descrição é um campo obrigatório.<br>";
                }
                if (!document.getElementById("purchasedAt").value) {
                    error_msg += "Comprado a é um campo obrigatório.<br>";
                }
                if (!document.getElementById("type").value) {
                    error_msg += "Tipo é um campo obrigatório.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("name").value,
                    document.getElementById("description").value,
                    document.getElementById("purchasedAt").value,
                    document.getElementById("type").value,
                ];
            },
        });

        // se não tem erros no preenchimento chama o serviço de validação
        if (formLogin) {
            objItem = {
                name: formLogin[0],
                description: formLogin[1],
                purchasedAt: formLogin[2],
                typeId: formLogin[3],


            };
            const json = JSON.stringify(objItem);
            const token=getCookie('login')
            $.ajax({
                url: linkUrl + "/item/new/",
                type: "post",
                data: json,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire({
                        icon: "success",
                        title: "Criado com sucesso.",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        getAllItens();
                    });

                },
                error: function (err) {
                    exit = err;
                }
            });

        }
    })();
    getAllItens();
}

function newInspection(v_id) {
    (async () => {
        const { value: formLogin } = await Swal.fire({
            title: "Inspecção do material",
            showCancelButton: true,
            confirmButtonText: "Criar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="inspectionForm" >' +
                '<div class="imgcontainer">' +
                '<i class="bi bi-pencil-square"></i></div><br><br>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Descrição</span>' +
                '<textarea id="description" class="form-control" maxlength="1000"></textarea>' +
                '</div>' +
                '</div></form>',
            preConfirm: () => {
                var error_msg = "";
                if (!document.getElementById("description").value) {
                    error_msg += "Descrição é um campo obrigatório.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("description").value,
                    1
                ];
            },
        });

        // se não tem erros no preenchimento chama o serviço de validação
        if (formLogin) {
            objItem = {
                description: formLogin[0],
            };
            const json = JSON.stringify(objItem);
            const token=getCookie('login')
            $.ajax({
                url: linkUrl + "/item/" + v_id + "/inspect/new",
                type: "post",
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
                        getAllItens();
                    });

                },
                error: function (err) {
                    exit = err;
                }
            });

        }
    })();
}

function viewInspection(v_id) {
    const token = getCookie('login')
    $.ajax({
        url: linkUrl + "/item/" + v_id + "/inspect/all",
        type: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
        success: function (data) {
            msg = data.message
            table = '';
            data = data.data;
            if (data.length > 0) {
                for (i in data) {
                    table += '<tr class="d-flex"><td class="col-9">' + data[i].description + '</td>'+
                    '<td class="col-3">' + data[i].createdAt.substr(0, 10) + '</td></tr>';
                }
            }
            (async () => {
                const { value: formLogin } = await Swal.fire({
                    title: "Histórico de Inspecções",
                    confirmButtonText: "OK",
                    showLoaderOnConfirm: true,
                    allowOutsideClick: true,
                    allowEnterKey: true,
                    html:
                        '<table class="table table-hover align-middle" id="itens">' +
                        '<tr class="d-flex">' +
                        '<th class="col-9">Descrição</th>' +
                        '<th class="col-3">Data</th>' +
                        '</tr>' +
                        table +
                        '</table>',
                });
            })();
        },
        error: function (err) {
            msg = JSON.parse(err.responseText);
            Swal.fire(
                'Aviso!',
                msg.message,
                'warning'
            );
            exit = err;
        }
    })
}

function changeCategory() {
    getAllItens();
}