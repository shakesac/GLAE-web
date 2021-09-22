// Chama o serviço que devolve todos as categorias do utilizador
function getAllSubsections(section) {
    (async () => {
        let searchUrl
        if (!section) searchUrl = "/subsection/all"
        else searchUrl = "/subsection/all?section=" + section;
        const token=getCookie("login");
        await $.ajax({
            url: linkUrl + searchUrl,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
            success: function (data) {
                table = document.getElementById('AllSubsections');
                data = data.data;
                if (data.length > 0) {
                    num = 0;
                    auxTable = '<table id="subsections" class="table table-hover align-middle">' +
                        '<tr class="d-flex">' +
                        '<th class="col-1 text-center">Código</th>' +
                        '<th class="col-8">Grupo</th>' +
                        '<th class="col-2">Secção</th>' +
                        '<th class="col-1"></th>' +
                        '</tr>';
                    for (i in data) {
                        num += 1
                        auxTable += '<tr class="d-flex">' +
                            '<td class="col-1 text-center"> ' + data[i].fullCode + '</td>' +
                            '<td class="col-8"> ' + data[i].subsection + '</td>' +
                            '<td class="col-2"> ' + data[i].section.section + '</td>' +
                            '</div></td><td class="col-1 text-end"><div class="btn-group" role="group" aria-label="action">' +
                            '<a href="javascript:editSubsection(' + data[i].id + ');" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-pencil-square"></i></button></a>' +
                            '<a href="javascript:delSubsection(' + data[i].id + ');" title="Eliminar"><button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></a>' +
                            '</div></td>'
                        auxTable += '</tr>';
                    }
                    table.innerHTML = auxTable + '</table>';
                } else {
                    table.innerHTML = '<div class="alert alert-danger" role="alert">' +
                        msg +
                        '</div>';
                }
            },
            error:function(err){
                const msg = JSON.parse(err.responseText);
                table.innerHTML = '<div class="alert alert-danger" role="alert">' +
                msg.message +
                '</div>';
            }
        })
    })();
}

function editSubsection(v_id) {
    (async () => {
        let subsection = "";
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + "/subsection/" + v_id,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                data = data.data;
                subsection = data.subsection;
                code = data.code
                sectionId = data.sectionId;
            }
        })
        await $.ajax({
            url: linkUrl + "/section/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                select = '<select id="sectionId" class="form-select">' +
                    '<option value=""></option>';
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        select += '<option value="' + data[i].id + '"';
                        if (data[i].id == sectionId) {
                            select += 'selected';
                        }
                        select += ' >' + data[i].section + '</option>';
                    }
                }
                select += '</select>'
            },
        })
        const { value: form } = await Swal.fire({
            title: "Editar Grupo",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            confirmButtonColor: '#212529',
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
                '<input type="text" id="type" class="form-control" maxlength="100" value="' + subsection + '" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Código</span>' +
                '<input type="number" id="code" class="form-control" min="0" max="9" value="' + code + '" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<label class="input-group-text" for="sectionId">Secção</label>' +
                select+
                '</div>' +
                '</div></form>',
            preConfirm: () => {
                let error_msg = "";
                if (!document.getElementById("type").value) {
                    error_msg += "O nome do tipo não pode ficar em branco.<br>";
                }
                if (!document.getElementById("code").value) {
                    error_msg += "O código não pode ficar em branco.<br>";
                }
                if (!document.getElementById("sectionId").value) {
                    error_msg += "A secção é obrigatória.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("type").value,
                    document.getElementById("code").value,
                    document.getElementById("sectionId").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (form) {
            objCategory = {
                subsection: form[0],
                code: form[1],
                sectionId: form[2]
            };
            var json = JSON.stringify(objCategory);
            $.ajax({
                url: linkUrl + "/subsection/" + v_id,
                type: "PUT",
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
                        getAllSubsections();
                    });
                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire(
                        'Erro!',
                        msg.message,
                        'error'
                    ).then(function () {
                        getAllSubsections();
                    });
                    exit = err;
                }
            });

        }
    })();
}

function createSubsection() {
    (async () => {
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + "/section/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                select = '<select id="sectionId" class="form-select">' +
                    '<option value=""></option>';
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        select += '<option value="' + data[i].id + '"';
                        select += ' >' + data[i].section + '</option>';
                    }
                }
                select += '</select>'
            },
        })
        const { value: form } = await Swal.fire({
            title: "Novo Grupo",
            showCancelButton: true,
            confirmButtonText: "Criar",
            confirmButtonColor: '#212529',
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
                '<input type="text" id="subsection" class="form-control" maxlength="100" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Código</span>' +
                '<input type="number" id="code" class="form-control" min="0" max="9" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Secção</span>' +
                select+
                '</div>' +
                '</div>',
            preConfirm: () => {
                let error_msg = "";
                if (!document.getElementById('subsection').value) {
                    error_msg += '"Nome" é um campo obrigatório.<br>'
                }
                if (!document.getElementById('code').value) {
                    error_msg += '"Código" é um campo obrigatório.<br>'
                }
                if (!document.getElementById("sectionId").value) {
                    error_msg += '"Secção" é um campo obrigatório.'
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("subsection").value,
                    document.getElementById("code").value,
                    document.getElementById("sectionId").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (form) {
            objSubSection = {
                subsection: form[0],
                code: form[1],
                sectionId: form[2]
            };
            var json = JSON.stringify(objSubSection);
            $.ajax({
                url: linkUrl + "/subsection/new",
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
                        getAllSubsections();
                    });
                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message,
                        confirmButtonColor: '#212529',
                    }).then(function () {
                        getAllSubsections();
                    });
                    exit = err;
                }
            });

        }
    })();
}

function delSubsection(v_id) {
    (async () => {
        const delSection = await Swal.fire({
            title: 'Tem a certeza?',
            text: "Esta acção é irreversível.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#d33',
            cancelButtonText: "Cancelar",
        });
        if (delSection.isConfirmed) {
            const token = getCookie('login')
            $.ajax({
                url: linkUrl + "/subsection/" + v_id,
                type: "DELETE",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire({                        
                        icon: 'success',
                        title: result.message,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(function () {
                        getAllSubsections();
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
                    })
                    exit = err;
                }
            });
        }

    })();
}

function getSection() {
    (async () => {
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + "/section/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
            success: function (data) {
                msg = data.message
                select = document.getElementById('sectionSelect');
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        let opt = document.createElement('option')
                        opt.value = data[i].id;
                        opt.innerHTML = data[i].section;
                        select.appendChild(opt);
                    }
                }
            },
        })
    })();
}

function setSelect(section) {
    document.getElementById('sectionSelect').value = section
}

function changeSection(section) {
    const thisSection = document.getElementById('sectionSelect').value
    getAllSubsections(thisSection);
}