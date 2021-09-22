function parseStatus(status) {
    let state
    switch(status) {
        case 'accepted':
            state = '<i class="bi bi-check-lg icon-green pe-2"></i>Aprovado'
            break
        case 'inProgress':
            state = '<i class="bi bi-play-fill icon-blue pe-2"></i></i>Em curso'
            break
        case 'canceled':
            state = '<i class="bi bi-x-lg icon-red pe-2"></i></i>Cancelado'
            break
        case 'refused':
            state = '<i class="bi bi-x-lg icon-red pe-2"></i></i>Não aprovado'
            break
        case 'pending':
            state = '<i class="bi bi-hourglass-split icon-orange pe-2"></i></i>Pendente'
            break
        case 'returned':
            state = '<i class="bi bi-check-square pe-2"></i></i>Terminado'
            break
    }
    return state
}

function actionButtons(status, id) {
    let actionButtons = '<button type="button" onclick="getLeaseItems('+ id +')" title="Ver material" class="btn btn-sm btn-outline-info pe-2">' +
    '<i class="bi bi-box-seam"></i>'+
    '</button>'
    switch(status) {
        case 'accepted':
            const inProgress = "'inProgress'"
            actionButtons += 
            '<button type="button" title="Iniciar emprestimo" class="btn btn-sm btn-outline-primary" onclick="updateStatus('+ id +','+ inProgress +')">'+
            '<i class="bi bi-play-fill"></i>'+
            '</button>'
            break
        case 'inProgress':
            const returned = "'returned'"
            actionButtons += '<button type="button" title="Terminar" class="btn btn-sm btn-outline-dark" onclick="updateStatus('+ id +','+ returned +')">'+
            '<i class="bi bi-arrow-return-right"></i>'+
            '</button>'
            break
        case 'canceled':
            break
        case 'refused':
            break
        case 'pending':
            const accepted = "'accepted'"
            const refused = "'refused'"
            actionButtons += '<button type="button" title="Aprovar" class="btn btn-sm btn-outline-success" onclick="updateStatus('+ id +','+ accepted +')">'+
            '<i class="bi bi-file-earmark-check"></i>'+
            '</button>'+
            '<button type="button" title="Recusar" class="btn btn-sm btn-outline-danger" onclick="updateStatus('+ id +','+ refused +')">'+
            '<i class="bi bi-file-earmark-excel"></i>'+
            '</button>'
            break
        case 'returned':
            break
    }
    actionButtons += '<button type="button" onclick="getStatusHistory('+ id +')" title="Ver histórico" class="btn btn-sm btn-outline-info pe-2">' +
    '<i class="bi bi-book"></i>'+
    '</button>'
    return actionButtons
}

function getAllLeases(state) {
    (async () => {
        let searchUrl = ''
        if (state) searchUrl = '/lease/all?status='+state
        else searchUrl = '/lease/all'
        //const limit = document.getElementById('limit').value;
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + searchUrl,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
            success: function (data) {
                msg = data.message
                table = document.getElementById('AllLeases');
                data = data.data;
                if (data.length > 0) {
                    auxTable = '<table class="table table-hover align-middle" id="itens">' +
                        '<tr class="d-flex">' +
                        '<th class="col-1 text-center">ID</th>' +
                        '<th class="col-1">Início</th>' +
                        '<th class="col-1">Termino</th>' +
                        '<th class="col-3 text-center">Estado</th>' +
                        '<th class="col-4">Utilizador</th>' +
                        '<th class="col-2">Acções</th>' +
                        '</tr>';
                    for (i in data) {
                        auxTable += '<tr class="d-flex fs-7">' +
                            '<td class="col-1 text-center">' + data[i].id + '</td>' +
                            '<td class="col-1">' + data[i].start + '</td>' +
                            '<td class="col-1"> ' + data[i].end + '</td>';
                        auxTable += '<td class="col-3 text-center"> ' + parseStatus(data[i].lease_statuses[0].status) + '</td>' +
                            '<td class="col-4">'+data[i].user.fullName+'</td>' +
                            '<td class="col-2"><div class="btn-group" role="group" aria-label="actionButtons">' +
                            actionButtons(data[i].lease_statuses[0].status, data[i].id) +
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
            error: function (err) {
                document.getElementById('AllLeases').innerHTML = '<div class="alert alert-danger" role="alert">' +
                    err.responseJSON.message +
                    '</div>';
                exit = err;
            }
        })
    })();
}

function getLeaseItems(lid) {
    const token = getCookie('login')
    $.ajax({
        url: linkUrl + "/lease/" + lid + "/items",
        type: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
        success: function (data) {
            msg = data.message
            table = ''
            data = data.data
            if (data.length > 0) {
                for (i in data) {
                    table += '<tr class="d-flex fs-7"><td class="col-4 align-middle">' + data[i].name + '</td>'+
                    '<td class="col-7 text-start align-middle">' + data[i].description + '</td>' +
                    //'<td class="col-1 text-center"> - </td>' +
                    '<td class="col-1 text-end">'+
                    '<button type="button" class="btn btn-sm round-btn btn-outline-danger" title="Remover item" onclick="removeItem('+ lid +','+data[i].id+')"><i class="bi bi-dash-lg"></i></button>'
                    '</td></tr>'
                }
            }
            (async () => {
                await Swal.fire({
                    title: '<i class="bi bi-box-seam pe-2"></i>Material',
                    width: 600,
                    showCancelButton: true,
                    cancelButtonText: 'Fechar',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEnterKey: true,
                    html:
                        '<table class="table table-hover align-middle" id="itens">' +
                        '<tr class="d-flex">' +
                        '<th class="col-4">Item</th>' +
                        '<th class="col-7 texte-start">Descrição</th>' +
                        //'<th class="col-1 text-center">Un.</th>' +
                        '<th class="col-1"></th>' +
                        '</tr>' +
                        table +
                        '</table>',
                });
            })();
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

function removeItem(lid, iid) {
    (async () => {
        await Swal.fire({
            title: 'Tem a certeza?',
            text: "Esta acção é irreversível.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#d33',
            cancelButtonText: "Cancelar",
        }).then((result) => {
            const token = getCookie('login')
            $.ajax({
                url: linkUrl + "/lease/" + lid + '/removeItem/' + iid,
                type: "DELETE",
                beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
                success: function (result) {
                    Swal.fire(
                        result.message,
                        'success'
                    ).then(function () {
                        getLeaseItems(lid)
                    });

                },
                error: function (err) {
                    msg = JSON.parse(err.responseText);
                    Swal.fire({
                        icon: 'error',
                        text: msg.message,
                        confirmButtonColor: '#212529',
                    }).then(function () {
                        getLeaseItems(lid)
                    })
                }
            });
        });
    })();
}

function updateStatus(id, status) {(
    async () => {
        const formUpdateStatus = await Swal.fire({
            title: '<i class="bi bi-clipboard"></i>Alterar estado',
            showCancelButton: true,
            confirmButtonText: "Alterar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            focusConfirm: true,
            html: '<form id="updateStatusForm" >' +
            '<div class="input-group input-group-sm mb-3">' +
            '<span class="input-group-text">Comentário</span>' +
            '<textarea id="comment" class="form-control" maxlength="1000"></textarea>' +
            '</div></form>',
        })
        if (formUpdateStatus.isConfirmed) {
            const comment = document.getElementById("comment").value
            const objStatus = {
                status,
                comment
            }
            const json = JSON.stringify(objStatus)
            const token = getCookie('login')
            $.ajax({
                url: linkUrl + "/lease/" + id + "/status",
                type: "PUT",
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
                        getAllLeases()
                    })
                },
                error: function(err) {
                    msg = JSON.parse(err.responseText)
                    Swal.fire(
                        'Aviso!',
                        msg.message,
                        'warning'
                    )
                    exit = err
                }
            })
        } else {
            
        }
    })()
}

function getStatusHistory(lid) {
    const token = getCookie('login')
    $.ajax({
        url: linkUrl + "/lease/" + lid + "/status",
        type: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token)},
        success: function (data) {
            msg = data.message
            let table = ''
            data = data.data
            if (data.length > 0) {
                for (i in data) {
                    let comment
                    if (!data[i].comment) comment = '<i class="text-muted">Não comentado</i>'
                    else comment = data[i].comment
                    table += '<tr class="d-flex"><td class="col-2 text-center">' + parseStatus(data[i].status) + '</td>'+
                    '<td class="col-8">' + comment + '</td>'+
                    '<td class="col-2 text-center">' + data[i].createdAt.substr(0,10) + '</td>'+
                    '</tr>'
                }
            }
            (async () => {
                await Swal.fire({
                    title: '<i class="bi bi-list pe-2"></i>Histórico de Estados',
                    width: 750,
                    confirmButtonText: "OK",
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    allowEnterKey: true,
                    html:
                    '<table class="table table-hover align-middle" id="status">' +
                    '<tr class="d-flex">' +
                    '<th class="col-2 text-center">Estado</th>' +
                    '<th class="col-8 text-center">Comentário</th>' +
                    '<th class="col-2">Data</th>' +
                    '</tr>' +
                    table +
                    '</table>',
                });
            })();
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
}

function setSelect(status) {
    document.getElementById('statusSelect').value = status
}

function changeStatus() {
    const status = document.getElementById('statusSelect').value
    getAllLeases(status);
}