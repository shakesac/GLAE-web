function getSection() {
    (async () => {
        await $.ajax({
            url: linkUrl + "/section/all",
            type: "GET",
            success: function (data) {
                msg = data.message
                select = document.getElementById('sectionId');
                data = data.data;
                if (data.length > 0) {
                    for (i in data) {
                        var opt = document.createElement('option')
                        opt.value = data[i].id;
                        opt.innerHTML = data[i].section;
                        select.appendChild(opt);

                    }

                }
            },
        })
    })();
}

function getSubSection(v_id) {
    (async () => {
        $.ajax({
            url: linkUrl + "/section/" + v_id + "/subs",
            type: "GET",
            success: function (data) {
                select = document.getElementById('subsectionId');
                select.options.length = 0;
                data = data.data;
                var opt = document.createElement('option')
                opt.value = '';
                opt.innerHTML = 'Grupo';
                select.appendChild(opt);
                for (i in data) {
                    opt = document.createElement('option')
                    opt.value = data[i].id;
                    opt.innerHTML = data[i].subsection;
                    select.appendChild(opt);
                }

            }
        })
    })();
}
getSection();