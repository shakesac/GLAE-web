loadPage()
function loadPage(){
    if (getCookie("bag")!="") {
        bag = JSON.parse(getCookie("bag"));
    } else {
        bag = []
    }
    getResume()
}

function getCategory() {
    (async () => {
        await $.ajax({
            url: linkUrl + "/item/category/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token) },
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
    getAllItens();
}

function checkDates(start, end) {
    const now = getDate(new Date())
    start = new Date(start)
    end = new Date(end)
    if (!start || !end) throw new Error('É necessário indicar a data desejada.')
    else if (start < now || end < now) throw new Error('Não é possível pedir emprestimos com datas anteriores à actual.')
    else if (start > end) throw new Error('A data de inicio tem de ser inferior à data de término.')
}

function getAllItens() {
    try {
        const start = document.getElementById('startDate').value
        const end = document.getElementById('endDate').value
        let category = document.getElementById('category').value
        checkDates(start, end);
        (async () => {
            let searchUrl
            if (!category) {
                searchUrl = `/item/all/available?start=${start}&end=${end}`
            } else {
                searchUrl = `/item/all/available?start=${start}&end=${end}&category=${category}`
            }
            const token = getCookie('login');
            $.ajax({
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
                            '<th class="col-6">Descrição</th>' +
                            '<th class="col-2">Tipo</th>' +
                            '<th class="col-1"></th>' +
                            '</tr>';
                        for (i in data) {
                            if (!bag.includes(data[i].id)) {
                                console.log(data[i])
                                let type
                                if (!data[i].item_type) type = data[i].type
                                else type = data[i].item_type.type
                                auxTable += '<tr class="d-flex">' +
                                    '<td class="col-2">' + data[i].name + '</td>' +
                                    '<td class="col-6 text-start">' + data[i].description + '</td>'
                                auxTable += '<td class="col-2"> ' + type + '</td>' +
                                    '<td class="col-1 text-end"><div class="btn-group" role="group" aria-label="inspection">' +
                                    '<a href="javascript:addItem(' + data[i].id + ', `' + data[i].name + '`);" title="Adicionar ao cesto"><button type="button" class="btn btn-sm round-btn btn-outline-success"><i class="bi bi-plus-lg"></i></button></a>' +
                                    '</div></td>'
                                auxTable += '</tr>';
                            }
                        }
                        table.innerHTML = auxTable + '</table>';
                    } else {
                        table.innerHTML = '<div class="alert alert-danger" role="alert">' +
                            'Não existem itens.' +
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
    } catch(err) {
        console.log(err)
        document.getElementById('AllItens').innerHTML = '<div class="alert alert-danger" role="alert">' +
        err.message +
        '</div>';
    exit = err;
    }
}

function getResume() {
    (async () => {
        token = getCookie("login");
        await $.ajax({
            url: linkUrl + "/item/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token); },
            success: function (data) {
                msg = data.message
                basket = document.getElementById('basket');
                data = data.data;
                num = 0;
                if (data.length > 0) {

                    for (i in data) {
                        if (bag.includes(data[i].id)) {
                            num += 1

                        }
                    }
                    if (num > 0) {
                        basket.innerHTML = '<i id="bag">' + num + '</i>';

                    } else {
                        basket.innerHTML = ''
                    }
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

function viewBasket() {
    if (bag.length < 1) {
        Swal.fire({
            title: '<i class="bi bi-basket pe-2"></i>Cesto',
            text: 'O cesto está vazio.',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Fechar',
            focusCancel: true,
            showCloseButton: true,
        })
    } else {
        $.ajax({
            url: linkUrl + "/item/all",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token) },
            success: function (data) {
                msg = data.message
                table = '';
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        if (bag.includes(data[i].id)) {
                            table += '<tr class="d-flex">' +
                                '<td class="col-10 text-start">' + data[i].name + '</td>' +
                                '<td class="col-2"><button onclick="removeItem(' + data[i].id + ')" type="button" class="btn btn-sm round-btn btn-outline-danger"><i class="bi bi-dash-lg"></i></button></td>' +
                                '</tr>';
                        }
                    }
                }
                (async () => {
                    const { formLogin } = await Swal.fire({
                        title: '<i class="bi bi-basket pe-2 pb-3"></i>Cesto',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: true,
                        allowEnterKey: true,
                        showCloseButton: true,
                        showConfirmButton: true,
                        showCancelButton: true,
                        cancelButtonText: 'Fechar',
                        focusCancel: true,
                        confirmButtonText: 'Finalizar pedido',
                        confirmButtonColor: '#212529',
                        html:
                            '<table class="table table-hover align-middle" id="itens">' +
                            '<tr class="d-flex">' +
                            '<th class="col-10 text-start">Item</th>' +
                            '<th class="col-2"></th>' +
                            '</tr>' +
                            table +
                            '</table>',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            checkOut()
                        }
                    })
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
}

function addItem(v_id, v_name) {
    bag.push(v_id)
    document.cookie = "bag=" + JSON.stringify(bag)
    getAllItens()
    getResume()

}


function removeItem(v_id) {
    (async () => {
        const { value: form } = await Swal.fire({
            text: 'Tem a certeza que quer remover este item do carrinho?',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Remover'
        });
        const token = getCookie('login')
        if (form) {

            Swal.fire({
                text: 'Item removido do carrinho.',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false,
            }).then(function () {
                removeArray(bag, v_id);
                document.cookie = "bag=" + JSON.stringify(bag)
                getAllItens()
                getResume()
                viewBasket()
            });


        }
    })();
}

function cleanBag() {
    document.cookie = "bag="
    bag = []
    getResume()
}

function checkOut(){
    (async () => {
        const { value: form } = await Swal.fire({
            text: 'Deseja finalizar o pedido?',
            icon: 'question',
            showCancelButton: true,
            //cancelButtonColor: '#3085d6',
            confirmButtonColor: '#212529',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            showLoaderOnConfirm: true,
        });
        const token=getCookie('login')
        if (form) {
            aux = []
            aux = bag
            objItem = {
                start: document.getElementById("startDate").value,
                end: document.getElementById("endDate").value,
                items: aux,
            };
            const json = JSON.stringify(objItem);
            const token=getCookie('login')
            $.ajax({
                url: linkUrl + "/lease/new",
                type: "post",
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
                        cleanBag() 
                        window.location = "/users/leases.html"
                    });

                },
                error: function (err) {
                    Swal.fire({
                        icon: 'error',
                        title: result.message,
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(function () {
                        cleanBag() 
                        window.location = "/users/leases.html"
                    });
                    exit = err;
                }
            });
        }
    })();
}

function refresh() {
    getAllItens()
}

function autoComplete() {
    document.getElementById('startDate').valueAsDate = new Date()
    document.getElementById('endDate').valueAsDate = new Date()
}

function getDate(date){
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function checkStart() {
    const input = document.getElementById('startDate')
    const value = input.value
    const checkBox = document.getElementById('forTheDay')
    if (!value) checkBox.disabled = true
    else checkBox.disabled = false
    const endDate = document.getElementById('endDate')
    if (checkBox.checked) endDate.value = input.value
    refresh()
}

function forTheDay() {
    const checkBox = document.getElementById('forTheDay')
    const endBox = document.getElementById('endDateDiv')
    if (checkBox.checked) {
        endBox.classList.add('d-none')
        document.getElementById('endDate').value = document.getElementById('startDate').value
    }
    else endBox.classList.remove('d-none')
}
//cleanBag()
// <--------------- LISTAGEM DE LEASES DO USER (/users/leases.html) ----------------->

function parseStatus(status) {
    let state
    switch (status) {
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
    const canceled = "'canceled'"
    switch(status) {
        case 'accepted':
            actionButtons += '<button type="button" title="Cancelar" class="btn btn-sm btn-outline-danger" onclick="updateStatus('+ id +','+ canceled +')">'+
            '<i class="bi bi-x-lg"></i>'+
            '</button>'
            break
        case 'inProgress':
            break
        case 'canceled':
            break
        case 'refused':
            break
        case 'pending':
            actionButtons += '<button type="button" title="Cancelar" class="btn btn-sm btn-outline-danger" onclick="updateStatus('+ id +','+ canceled +')">'+
            '<i class="bi bi-x-lg"></i>'+
            '</button>'
            break
        case 'returned':
            break
    }
    actionButtons += '<button type="button" onclick="getStatusHistory(' + id + ')" title="Ver histórico" class="btn btn-sm btn-outline-info pe-2">' +
        '<i class="bi bi-book"></i>' +
        '</button>'
    return actionButtons
}

function getUserLeases(state) {
    (async () => {
        let searchUrl = ''
        if (state) searchUrl = '/me/leases?status=' + state
        else searchUrl = '/me/leases'
        const token = getCookie('login')
        await $.ajax({
            url: linkUrl + searchUrl,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token) },
            success: function (data) {
                let msg = data.message
                let table = document.getElementById('allLeases');
                data = data.data;
                if (data.length > 0) {
                    auxTable = '<table class="table table-hover align-middle" id="itens">' +
                        '<tr class="d-flex">' +
                        '<th class="col-1 text-center">ID</th>' +
                        '<th class="col-2">Início</th>' +
                        '<th class="col-2">Termino</th>' +
                        '<th class="col-5 text-center">Estado</th>' +
                        '<th class="col-2">Acções</th>' +
                        '</tr>';
                    for (i in data) {
                        auxTable += '<tr class="d-flex fs-7">' +
                            '<td class="col-1 text-center">' + data[i].id + '</td>' +
                            '<td class="col-2">' + data[i].start + '</td>' +
                            '<td class="col-2"> ' + data[i].end + '</td>';
                        auxTable += '<td class="col-5 text-center"> ' + parseStatus(data[i].lease_statuses[0].status) + '</td>' +
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
                const msg = JSON.parse(err.responseText);
                document.getElementById('allLeases').innerHTML = '<div class="w-100 alert alert-danger" role="alert">' +
                msg.message +
                '</div>'
            }
        })
    })();
}

function getLeaseItems(lid) {
    const token = getCookie('login')
    $.ajax({
        url: linkUrl + "/lease/" + lid + "/items",
        type: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('x-access-token', token) },
        success: function (data) {
            msg = data.message
            table = ''
            data = data.data
            if (data.length > 0) {
                for (i in data) {
                    table += '<tr class="d-flex fs-7"><td class="col-4 align-middle">' + data[i].name + '</td>'+
                    '<td class="col-8 text-start align-middle">' + data[i].description + '</td>' +
                    //'<td class="col-1 text-center"> - </td>' +
                    '</tr>'
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
                        '<th class="col-8">Descrição</th>' +
                        //'<th class="col-1 text-center">Un.</th>' +
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
            Swal.fire({
                icon: 'error',
                text: msg.message,
                confirmButtonColor: '#212529',
            })
        }
    })
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
                        getUserLeases()
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

function changeStatus() {
    const status = document.getElementById('status').value
    getUserLeases(status);
}