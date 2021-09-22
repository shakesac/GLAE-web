// Chama o serviço que devolve todos as categorias do utilizador
function getAllSections() {
    (async () => {
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + "/section/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                table = document.getElementById('AllSection');
                msg = data.message;
                data = data.data;
                if (data.length > 0) {
                    num = 0;
                    auxTable = '<table class="table table-hover align-middle" id="sections">' +
                        '<tr class="d-flex">' +
                        '<th class="col-1 text-center">Código</th>' +
                        '<th class="col-9">Categoria</th>' +
                        '<th class="col-1"></th>' +
                        '<th class="col-1"></th>' +
                        '</tr>';
                    for (i in data) {
                        num += 1
                        auxTable += '<tr class="d-flex">' +
                            '<td class="col-1 text-center">' + data[i].code + '</td>' +
                            '<td class="col-9">' + data[i].section + '</td>' +
                            `<td class="col-1 text-end"><button onclick="window.location.href='/admin/subsections.html?section=${data[i].id}'" type="button" title="Ver grupos" class="btn btn-sm btn-outline-info"><i class="bi bi-list"></i></button></td>` +
                            '</div></td><td class="col-1 text-center"><div class="btn-group" role="group" aria-label="action">' +
                            '<a href="javascript:editSection(' + data[i].id + ');" title="Editar"><button type="button" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-pencil-square"></i></button></a>' +
                            '<a href="javascript:delSection(' + data[i].id + ');" title="Eliminar"><button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></a>' +
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

function editSection(v_id) {
    (async () => {
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + "/section/" + v_id,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                data = data.data;
                code = data.code;
                section = data.section;
            }
        })
        const { value: sectionForm } = await Swal.fire({
            title: "Editar secção",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            confirmButtonColor: '#212529',
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="sectionForm" >' +
                '<p style="font-size: 50px">' +
                '<i class="bi bi-pencil-square"></i></p>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Nome</span>' +
                '<input type="text" id="section" class="form-control" maxlength="100" value="' + section + '" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Código</span>' +
                '<input type="number" id="code" class="form-control" min="0" max="9" value="' + code + '" required>' +
                '</div>' +
                '</div>',
            preConfirm: () => {
                let errorMsg = ''
                if (!document.getElementById('section').value) {
                    errorMsg += '"Nome" é um campo obrigatório.<br>'
                }
                if (!document.getElementById('code').value) {
                    errorMsg += '"Código" é um campo obrigatório.'
                }
                if (errorMsg) Swal.showValidationMessage(errorMsg)
                return [
                    document.getElementById("code").value,
                    document.getElementById("section").value,
                ];
            },
        });
        if (sectionForm) {
            objSection = {
                code: sectionForm[0],
                section: sectionForm[1]
            };
            const json = JSON.stringify(objSection);
            const token = getCookie('login')
            $.ajax({
                url: linkUrl + "/section/" + v_id,
                type: "PUT",
                data: json,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    getAllSections();
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
                    })
                }
            })

        }
    })();
}

function createSection() {
    (async () => {
        const { value: formLogin } = await Swal.fire({
            title: "Nova secção",
            showCancelButton: true,
            confirmButtonText: "Criar",
            confirmButtonColor: '#212529',
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            html:
                '<form id="sectionForm">' +
                '<p style="font-size: 50px">' +
                '<i class="bi bi-pencil-square"></i></p>' +
                '<div class="container">' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Nome</span>' +
                '<input type="text" id="section" class="form-control" maxlength="100" required>' +
                '</div>' +
                '<div class="input-group input-group-sm mb-3">' +
                '<span class="input-group-text">Código</span>' +
                '<input type="number" id="code" class="form-control" min="0" max="9" required>' +
                '</div>' +
                '</div>',
            preConfirm: () => {
                let errorMsg = ''
                if (!document.getElementById('section').value) {
                    errorMsg += '"Nome" é um campo obrigatório.<br>'
                }
                if (!document.getElementById('code').value) {
                    errorMsg += '"Código" é um campo obrigatório.'
                }
                if (errorMsg) Swal.showValidationMessage(errorMsg)
                return [
                    document.getElementById("code").value,
                    document.getElementById("section").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (formLogin) {
            obSection = {
                code: formLogin[0],
                section: formLogin[1]
            };
            const json = JSON.stringify(obSection);
            const token = getCookie('login')
            $.ajax({
                url: linkUrl + "/section/new",
                type: "POST",
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
                        getAllSections()
                    })
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

function delSection(v_id) {
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
        })
        if (delSection.isConfirmed) {
            const token = getCookie('login')
            $.ajax({
                url: linkUrl + "/section/" + v_id,
                type: "DELETE",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire({                        
                        icon: 'success',
                        title: result.message,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(function () {
                        getAllSections()
                    })
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