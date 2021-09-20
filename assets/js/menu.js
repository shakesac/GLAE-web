function navBar() {
    let navBar = '<div class="navbar navbar-dark bg-dark flex-md-nowrap p-0 shadow">'+
    '<a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">GLAE 1240</a>'+
    '<div class="navbar-nav">'+
    '<div class="nav-item text-nowrap">'+
    '<a class="nav-link px-3" href="#" onclick="signOut();">Terminar sessão</a>'+
    '</div>'+
    '</div>'+
    '</div>'
    document.getElementById("navBar").innerHTML = navBar;
}

function getMenu(){
    menu ='  <ul class="nav flex-column">'+
                '<li class="nav-item">'+
                '<a class="nav-link" aria-current="page" href="/home.html">'+
                    '<i class="bi bi-columns pe-2"></i>'+
                    'Inicio'+
                '</a>'+
                '</li>'+
                '<hr />'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/users.html">'+
                    '<i class="bi bi-person pe-2"></i>'+
                    'Utilizadores'+
                '</a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/sections.html">'+
                    '<i class="bi bi-collection pe-2"></i>'+
                    'Secções'+
                '</a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/subsections.html">'+
                    '<i class="bi bi-people pe-2"></i>'+
                    'Grupos'+
                '</a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/cargos.html">'+
                    '<i class="bi bi-briefcase pe-2"></i>'+
                    'Cargos'+
                '</a>'+
                '</li>'+
                '<hr />'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/items.html">'+
                    '<i class="bi bi-box-seam pe-2"></i>'+
                    'Material'+
                '</a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/categories.html">'+
                    '<i class="bi bi-tag pe-2"></i>'+
                    'Categorias'+
                '</a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/types.html">'+
                    '<i class="bi bi-list-ul pe-2"></i>'+
                    'Tipos'+
                '</a>'+
                '</li>'+
                '<hr />'+                
            '</ul>'+
            '<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mb-1 text-muted">'+
                '<span>Emprestimos</span>'+
            '</h6>'+
            '<ul class="nav flex-column mb-2">'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/leases.html?status=inProgress">'+
                    '<i class="bi bi-clipboard-data pe-2"></i>'+
                    'Em curso'+
                '</a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/leases.html?status=pending">'+
                    '<i class="bi bi-clipboard pe-2"></i>'+
                    'Pendentes'+
                '</a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/leases.html?status=returned">'+
                    '<i class="bi bi-clipboard-check pe-2"></i>'+
                    'Concluídos'+
                '</a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<a class="nav-link" href="/admin/leases.html?status=canceled">'+
                    '<i class="bi bi-clipboard-x pe-2"></i>'+
                    'Cancelados'+
                '</a>'+
                '</li>'+
            '</ul>';

    document.getElementById("menu").innerHTML = menu;
}

function getUserMenu() {
    menu =
    '<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">'+
        '<div class="container">'+
            '<a class="navbar-brand" href="#">GLAE 1240</a>'+
            '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">'+
                '<span class="navbar-toggler-icon"></span>'+
            '</button>'+
            '<div class="collapse navbar-collapse" id="navbarCollapse">'+
                '<ul class="navbar-nav me-auto mb-2 mb-md-0">'+
                    '<li class="nav-item">'+
                        '<a class="nav-link text-white" href="/users/index.html">Inicio</a>'+
                    '</li>'+
                    '<li class="nav-item">' +
                        '<a class="nav-link" href="/users/newLease.html">Solicitar emprestimo</a>'+
                    '</li>'+
                    '<li class="nav-item">'+
                        '<a class="nav-link" href="/users/leases.html">Consultar emprestimos</a>'+
                    '</li>'+
                '</ul>'+
                    /*'<form class="d-flex">'+
                        '<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">'+
                        '<button class="btn btn-outline-success" type="submit">Search</button>'+
                    '</form>'+*/
                    '<div class="d-flex">'+
                    '<ul class="navbar-nav me-auto mb-2 mb-md-0">'+
                    '<li class="nav-item">'+
                        '<a class="nav-link fs-5 text-white" href="#" onclick="viewBasket();"><i class="bi bi-basket" id="basket"></i></a>'+
                    '</li>'+
                    '</ul>'+
                    '<ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-3">'+
                        '<li class="nav-item dropdown">'+
                            '<a class="nav-link dropdown-toggle text-light fs-5" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">'+
                                '<i class="bi bi-person-square pe-2"></i>'+
                            '</a>'+
                            '<ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="profileDropdown">'+
                            '<li><a class="dropdown-item" href="/users/profile.html">Editar informações</a></li>'+
                            '<li><hr class="dropdown-divider"></li>'+
                            '<li><a class="dropdown-item" href="#" onclick="signOut()">Terminar sessão</a></li>'+
                          '</ul>'
                        '</li>'
                    '</ul>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</nav>'
    document.getElementById('userMenu').innerHTML = menu
}


function expireAllCookies(name, paths) {
    var expires = new Date(0).toUTCString();

    // expire null-path cookies as well
    document.cookie = name + '=; expires=' + expires;

    for (var i = 0, l = paths.length; i < l; i++) {
        document.cookie = name + '=; path=' + paths[i] + '; expires=' + expires;
    }
}

function signOut(){
    expireAllCookies('bag', ['/', '/users','/admin']);
    expireAllCookies('login', ['/', '/users', '/admin']);
    window.location = "/login.html";
}