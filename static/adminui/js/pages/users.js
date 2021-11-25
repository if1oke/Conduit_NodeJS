const loadUsers = () => {
    fetch('/api/users', {
        headers: {
            'Authorization': headerToken
        }
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if ($.fn.dataTable.isDataTable('#usersTable')) {
                $('#usersTable').DataTable().destroy()
            }
            $('#usersTable').DataTable({
                lengthChange: false,
                language: {
                    url: '/static/adminui/datatable_ru.json'
                },
                data: res.users,
                columns: [
                    {data: 'email', fnCreatedCell: function (nTd, sData, oData) {
                        $(nTd).html(`<a href="/admin/users/?=${oData.email}">
<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 48 48"  class="ms-2"><title>profile</title><g class="nc-icon-wrapper"><path d="M43.25,37.8,30,32V22H18V32l-.125.062L4.754,37.8A4.985,4.985,0,0,0,2,42.009V45a1,1,0,0,0,1,1H45a1,1,0,0,0,1-1V42.009A4.979,4.979,0,0,0,43.25,37.8Z" fill="#4a40ce" fill-rule="evenodd"></path><path d="M24,28A11.013,11.013,0,0,1,13,17V13a11,11,0,0,1,22,0v4A11.013,11.013,0,0,1,24,28Z" fill="#857cf8"></path></g></svg>
<span class="ps-2">${oData.email}</span>
</a>`)
                        }},
                    {data: 'username'},
                    {data: 'purchases', fnCreatedCell: function (nTd, sData, oData) {
                            if (oData.purchases > 0) $(nTd).html("<span class='badge badge-sm bg-gradient-primary'>" + oData.purchases + "</span>");
                            else $(nTd).html("<span class='badge badge-sm bg-gradient-secondary'>" + oData.purchases + "</span>");
                        }},
                    {data: 'earnings', fnCreatedCell: function (nTd, sData, oData) {
                        if (oData.earnings > 0) $(nTd).html("<span class='badge badge-sm bg-gradient-primary'>" + oData.earnings + "</span>");
                        else $(nTd).html("<span class='badge badge-sm bg-gradient-secondary'>" + oData.earnings + "</span>");
                        }},
                    {data: 'createdAt', fnCreatedCell: function (nTd, sData, oData) {
                        $(nTd).html(`${moment(oData.createdAt).utc().format('DD.MM.YYYY')}`)
                        }},
                    {data: 'isAdmin', fnCreatedCell: function (nTd, sData, oData) {
                        let userGroup = 'Клиент'
                        if (oData.isAdmin === true) {
                            userGroup = 'Администратор'
                        }
                        $(nTd).html(userGroup)
                        }}
                ]
            })
            $('#usersTable_filter input[type="search"]').attr('placeholder', 'Table search');
        })
}

loadUsers()
