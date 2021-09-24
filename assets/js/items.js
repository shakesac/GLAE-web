
function getCategory() {
    (async () => {
        const token = getCookie('login')
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
                        '<th class="col-1 text-center">Cód.</th>' +
                        '<th class="col-2">Nome</th>' +
                        '<th class="col-4">Descrição</th>' +
                        '<th class="col-1">Aquisição</th>' +
                        '<th class="col-1">Tipo</th>' +
                        '<th class="col-1 text-center">Inspecções</th>' +
                        '<th class="col-2"></th>' +
                        '</tr>';
                    for (i in data) {
                        let code, description
                        if (!data[i].subsection || !data[i].code) code = 'N/D'
                        else {
                            data[i].code = (data[i].code).toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false})
                            code = data[i].subsection.section.code+''+data[i].subsection.code+'.'+ data[i].item_type.item_category.code +''+ data[i].code
                        }
                        if (!data[i].description) description = '<i class="text-muted">Sem descrição</i>'
                        else description = data[i].description
                        auxTable += '<tr class="d-flex">' +
                            '<td class="col-1 fs-7 text-center">' + code + '</td>' +
                            '<td class="col-2">' + data[i].name + '</td>' +
                            '<td class="col-4">' + description + '</td>' +
                            '<td class="col-1 fs-7"> ' + data[i].purchasedAt + '</td>';
                        auxTable += '<td class="col-1"> ' + data[i].item_type.type + '</td>' +
                            '<td class="col-1 text-end"><div class="btn-group" role="group" aria-label="inspection">' +
                            '<a href="javascript:newInspection(' + data[i].id + ');" title="Nova inspecção"><button type="button" class="btn btn-sm btn-outline-info me-1"><i class="bi bi-file-earmark-plus"></i></button></a>' +
                            '<a href="javascript:viewInspection(' + data[i].id + ');" title="Ver inspecções"><button type="button" class="btn btn-sm btn-outline-info"><i class="bi bi-file-text"></i></button></a>' +
                            '</div></td><td class="col-2 text-end"><div class="btn-group" role="group" aria-label="action">' +
                            '<a href="javascript:editItem(' + data[i].id + ');" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-archive"></i></button></a>' +
                            `<button type="button" class="btn btn-sm btn-outline-danger me-1" onClick="endOfLife(${data[i].id})"><i class="bi bi-pencil-square"></i></button>` +
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
        const token = getCookie('login')
        $.ajax({
            url: linkUrl + "/item/category/" + v_id + "/types",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
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
    const token=getCookie('login')
    let typeId = ''
    let name = ''
    let description = ''
    let purchasedAt = ''
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
            let subsection
            if (!data.subsection) subsection = null
            else subsection = data.subsection.id
            let select, selectGroup
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
                await $.ajax({
                    url: linkUrl + "/subsection/all",
                    type: "GET",
                    beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                    success: function (data) {
                        msg = data.message
                        selectGroup = '<select id="subsection" class="form-select">' +
                            '<option value=""></option>';
                        data = data.data;
                        if (data.length > 0) {
                            for (i in data) {
                                selectGroup += '<option value="' + data[i].id + '"';
                                if (data[i].id == subsection) {
                                    selectGroup += 'selected';
                                }
                                selectGroup += ' >' + data[i].subsection + '</option>';
                            }
                        }
                        selectGroup += '</select>'
                    },
                })
                const { value: editItem } = await Swal.fire({
                    title: "Editar item",
                    showCancelButton: true,
                    confirmButtonText: "Guardar",
                    confirmButtonColor: '#212529',
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
                        `<input type="text" id="name" class="form-control" value="${name}" maxlength="100" required>` +
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
                        '<label class="input-group-text" for="subsection">Grupo</label>' +
                        selectGroup +
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
                            error_msg += '"Nome" é um campo obrigatório.<br>'
                        }
                        if (!document.getElementById("purchasedAt").value) {
                            error_msg += '"Aquisição" é um campo obrigatório.<br>'
                        }
                        if (!document.getElementById('subsection').value) {
                            error_msg += '"Grupo" é um campo obrigatório.'
                        }
                        if (error_msg) {
                            Swal.showValidationMessage(error_msg);
                        }
                        return [
                            document.getElementById("name").value,
                            document.getElementById("description").value,
                            document.getElementById("purchasedAt").value,
                            document.getElementById("type").value,
                            document.getElementById('subsection').value
                        ];
                    },
                });
                if (editItem) {
                    objItem = {
                        name: editItem[0],
                        description: editItem[1],
                        purchasedAt: editItem[2],
                        typeId: editItem[3],
                        subsectionId: editItem[4]
                    };
                    const json = JSON.stringify(objItem);
                    $.ajax({
                        url: linkUrl + "/item/" + v_id,
                        type: "PUT",
                        data: json,
                        contentType: "application/json",
                        dataType: "json",
                        beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                        success: function (result) {
                            console.log(result)
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
                            console.log(err)
                            msg = JSON.parse(err.responseText);
                            Swal.fire({
                                icon: 'error',
                                text: msg.message,
                                confirmButtonColor: '#212529',
                            })
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
            text: "Esta acção é irreversível.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#d33',
            cancelButtonText: "Cancelar",
        });
        const token=getCookie('login')
        if (form) {
            $.ajax({
                url: linkUrl + "/item/" + v_id,
                type: "DELETE",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire({                        
                        icon: 'success',
                        title: result.message,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(function () {
                        getAllItens();
                    });
                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message,
                        confirmButtonColor: '#212529',
                    })
                }
            });
        }
    })();
}

function createItem() {
    let select, selectGroup
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
        await $.ajax({
            url: linkUrl + "/subsection/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                selectGroup = '<select id="subsection" class="form-select">' +
                    '<option value=""></option>';
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        selectGroup += '<option value="' + data[i].id + '"';
                        selectGroup += ' >' + data[i].subsection + '</option>';
                    }
                }
                selectGroup += '</select>'
            },
        })
        const { value: createItem } = await Swal.fire({
            title: "Novo item",
            showCancelButton: true,
            confirmButtonText: "Criar",
            confirmButtonColor: '#212529',
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="itemForm">' +
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
                '<label class="input-group-text" for="subsection">Grupo</label>' +
                selectGroup +
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
                let errorMsg = ''
                if (!document.getElementById('name').value) {
                    errorMsg += '"Nome" é um campo obrigatório.<br>'
                }
                if (!document.getElementById('purchasedAt').value) {
                    errorMsg += '"Aquisição" é um campo obrigatório.<br>'
                }
                if (!document.getElementById('subsection').value) {
                    errorMsg += '"Grupo" é um campo obrigatório.<br>'
                }
                if (errorMsg) Swal.showValidationMessage(errorMsg)
                return [
                    document.getElementById("name").value,
                    document.getElementById("description").value,
                    document.getElementById("purchasedAt").value,
                    document.getElementById("type").value,
                    document.getElementById('subsection').value
                ];
            },
        });
        if (createItem) {
            objItem = {
                name: createItem[0],
                description: createItem[1],
                purchasedAt: createItem[2],
                typeId: createItem[3],
                subsectionId: createItem[4]
            };
            const json = JSON.stringify(objItem);
            $.ajax({
                url: linkUrl + "/item/new/",
                type: "post",
                data: json,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire({
                        icon: 'success',
                        title: result.message,
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        getAllItens();
                    });
                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message,
                        confirmButtonColor: '#212529',
                    })
                }
            });
        }
    })();
}

function endOfLife(v_id) {
    (async () => {
        const { value: endOfLife } = await Swal.fire({
            title: 'Tem a certeza?',
            text: 'Será permanentemente arquivado como artigo em fim de vida.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Arquivar',
            confirmButtonColor: '#d33',
            cancelButtonText: "Cancelar",
        });
        const token=getCookie('login')
        if (endOfLife) {
            $.ajax({
                url: linkUrl + "/item/" + v_id + '/endoflife',
                type: "PUT",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire({                        
                        icon: 'success',
                        title: result.message,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(function () {
                        getAllItens();
                    });
                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message,
                        confirmButtonColor: '#212529',
                    })
                }
            });
        }
    })();
}

function newInspection(v_id) {
    (async () => {
        const { value: newInspection } = await Swal.fire({
            title: "Inspecção do item",
            showCancelButton: true,
            confirmButtonText: "Criar",
            confirmButtonColor: '#212529',
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
                    error_msg += `"Descrição" é um campo obrigatório.<br>`
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
        if (newInspection) {
            objItem = {
                description: newInspection[0],
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
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message,
                        confirmButtonColor: '#212529',
                    })
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
                    table += '<tr class="d-flex"><td class="col-9 text-start">' + data[i].description + '</td>'+
                    '<td class="col-3 align-middle">' + data[i].createdAt.substr(0, 10) + '</td></tr>';
                }
            }
            (async () => {
                const { value: formLogin } = await Swal.fire({
                    title: "Histórico de Inspecções",
                    showConfirmButton: false,
                    showCloseButton: true,
                    focusClose: false,
                    showLoaderOnConfirm: true,
                    allowOutsideClick: true,
                    allowEnterKey: true,
                    html:
                        '<table class="table table-hover align-middle fs-7" id="itens">' +
                        '<tr class="d-flex">' +
                        '<th class="col-9 text-start">Descrição</th>' +
                        '<th class="col-3">Data</th>' +
                        '</tr>' +
                        table +
                        '</table>',
                });
            })();
        },
        error: function (err) {
            msg = JSON.parse(err.responseText);
            Swal.fire({
                icon: 'info',
                text: msg.message,
                confirmButtonColor: '#212529',
            })
        }
    })
}

function getAllHistory() {
    let category = document.getElementById("category").value;
    (async () => {
        if (category == "") {
            searchUrl = "/item/history";
        } else {
            searchUrl = "/item/history?category=" + category;
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
                        '<th class="col-1 text-center">Cód.</th>' +
                        '<th class="col-2">Nome</th>' +
                        '<th class="col-5">Descrição</th>' +
                        '<th class="col-1">Aquisição</th>' +
                        '<th class="col-2">Tipo</th>' +
                        '<th class="col-1 text-center">Inspecções</th>' +
                        '</tr>';
                    for (i in data) {
                        let code, description
                        if (!data[i].subsection || !data[i].code) code = 'N/D'
                        else {
                            data[i].code = (data[i].code).toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false})
                            code = data[i].subsection.code + ''+ data[i].subsection.section.code +'.'+ data[i].item_type.item_category.code +''+ data[i].code
                        }
                        if (!data[i].description) description = '<i class="text-muted">Sem descrição</i>'
                        else description = data[i].description
                        auxTable += '<tr class="d-flex">' +
                            '<td class="col-1 fs-7 text-center">' + code + '</td>' +
                            '<td class="col-2">' + data[i].name + '</td>' +
                            '<td class="col-5">' + description + '</td>' +
                            '<td class="col-1 fs-7"> ' + data[i].purchasedAt + '</td>';
                        auxTable += '<td class="col-2"> ' + data[i].item_type.type + '</td>' +
                            '<td class="col-1 text-center"><div class="btn-group" role="group" aria-label="inspection">' +
                            '<a href="javascript:viewInspection(' + data[i].id + ');" title="Ver inspecções"><button type="button" class="btn btn-sm btn-outline-info"><i class="bi bi-file-text"></i></button></a>' +
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

function toggleArquivados() {
    const button = document.getElementById('toggleArquivados')
    const cat = document.getElementById('categorySelect')
    if (button.checked) {
        getAllHistory()
        cat.classList.add('d-none')
    } else {
        getAllItens()
        cat.classList.remove('d-none')
    }
}

function resetToggle() {
    const button = document.getElementById('toggleArquivados')
    if (button.checked) {
        button.checked = false
    }
}

function changeCategory() {
    getAllItens();
}