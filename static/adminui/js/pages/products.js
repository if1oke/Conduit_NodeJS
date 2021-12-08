const getCategories = () => {
    $('#categoryList').html('<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>')
    fetch('/api/categories')
        .then(res => res.json())
        .then(res => {
            let html = ''
            res.categories.forEach(item => {
                html += `<div class="my-1">
                            <span id="${item}_name" class="font-weight-bold opacity-7 ms-2">${item}</span>
                            <div style="display: none" id="${item}_input">
                                <input id="${item}_inputText" type="text" value="${item}" class="form-control w-75 d-inline-block">
                                <button type="button" onclick="saveClick(this)" id="${item}_save" class="btn mt-1 px-3 btn-sm btn-primary mb-0 float-end">
                                    <span class="mdi mdi-content-save"></span>
                                </button>
                            </div>
                            <a id="${item}_remove" href="#" class="float-end text-danger text-gradient" onclick="deleteClick(this)">
                                <span class="mdi mdi-delete"></span>
                            </a>
                            <a id="${item}_edit" onclick="editClick(this)" href="#" class="float-end text-primary text-gradient me-3">
                                <span class="mdi mdi-pencil text-primary"></span>
                            </a>
                        </div>`
            })
            $('#categoryList').html(html)
        })
}

const getProducts = () => {
    $('#productsLoader').show()
    fetch('/api/products')
        .then(res => res.json())
        .then(res => {

            let chartData = {}
            let productStat = {
                available: 0,
                total: 0
            }
            const data = res.products
            data.forEach(item => {
                productStat.total++
                if (item.available === true) {
                    productStat.available++
                }
                if (item.CategoryName in chartData) {
                    chartData[item.CategoryName]++
                }  else {
                    chartData[item.CategoryName] = 1
                }
            })

            $('#productsStatCount').html(`<span class="badge badge-circle bg-gradient-primary">${productStat.total}</span>`)
            $('#productsStatAvailable').html(`<span class="badge badge-circle bg-gradient-primary">${productStat.available}</span>`)

            $('#productsLoader').hide()
            if ($.fn.dataTable.isDataTable('#productsTable')) {
                $('#productsTable').DataTable().destroy()
            }
            $('#productsTable').DataTable({
                lengthChange: false,
                language: {
                    url: '/static/adminui/datatable_ru.json'
                },
                data: data,
                columns: [
                    {data: 'image', fnCreatedCell: function (nTd, sData, oData) {
                        if(oData.image) $(nTd).html(`<div class="d-flex px-2"><div><img src="/static/upload/${oData.image}" class="avatar avatar-sm rounded-circle me-2"></div></div>`)
                        }},
                    {data: 'name', fnCreatedCell: function (nTd, sData, oData) {
                        if (oData.ManufacturerName === null) oData.ManufacturerName = 'Не указано'
                            $(nTd).html(`<div><a href="/admin/products/${oData.id}">${oData.name}</a></div><div class="text-sm">${oData.ManufacturerName}</div>`)
                        }},
                    {data: 'CategoryName'},
                    {data: 'tagList'},
                    {data: 'weight'},
                    {data: 'price'},
                    {data: 'available', fnCreatedCell: function (nTd, sData, oData) {
                        if (oData.available === true) {
                            $(nTd).html('<span class="badge bg-gradient-primary"><span class="mdi mdi-check text-white"></span></span>')
                        } else {
                            $(nTd).html('<span class="badge bg-gradient-secondary"><span class="mdi mdi-cancel text-white"></span></span>')
                        }
                        }}
                ]
            })
            productsChart(chartData)
        })
}

const editClick = (item) => {
    const catName = (item.id).replace('_edit', '')
    $(`#${catName}_name`).hide()
    $(`#${catName}_edit`).hide()
    $(`#${catName}_remove`).hide()
    $(`#${catName}_input`).show()
}

const deleteClick = item => {
    const remove = confirm('Удалить категорию?')
    if (remove) {
        const catName = (item.id).replace('_remove', '')
        fetch('/api/categories/' + catName, {
            method: 'DELETE',
            headers: {
                'Authorization': headerToken
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.categories) {
                    toastr.success('Категория удалена')
                } else {
                    toastr.error('Произошла ошибка')
                }
                getCategories()
                getProducts()
            })
    }
}

const saveClick = (item) => {
    const oldCatName = (item.id).replace('_save', '')
    const newCatName = $(`#${oldCatName}_inputText`).val()
    fetch('/api/categories/' + oldCatName, {
        method: 'PATCH',
        headers: {
            'Authorization': headerToken,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            category: {
                name: newCatName
            }
        })
    })
        .then(res => res.json())
        .then(res => {
            if(res.categories) {
                toastr.success('Категория успешно изменена')
            } else {
                toastr.error('Произошла ошибка')
            }
            getCategories()
            getProducts()
        })
}

const addCategory = () => {
    const newCategory = $('#categoryAddInput').val()
    if (newCategory.length > 1) {
        $('#categoryAdd').hide()
        fetch('/api/categories/', {
            method: 'POST',
            headers: {
                'Authorization': headerToken,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                category: {
                    name: newCategory
                }
            })
        })
            .then(res => res.json())
            .then(res => {
                if(res.categories) {
                    toastr.success('Категория успешно создана')
                } else {
                    toastr.error('Произошла ошибка')
                }
                getCategories()
                getProducts()
            })
    } else {
        toastr.error('Слишком короткое имя')
    }
}

const showCategoryAdd = () => {
    $('#categoryAdd').toggle('fast')
}

const productsChart = (data) => {
    const ctx = document.getElementById('productsChart').getContext('2d')
    let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, "#80b6f4");
    gradientStroke.addColorStop(1, "#f49080");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                borderWidth: 0,
                borderRadius: 6,
                borderSkipped: false,
                backgroundColor: gradientStroke,
                data: Object.values(data),
                maxBarThickness: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 500,
                        beginAtZero: true,
                        padding: 15,
                        font: {
                            size: 14,
                            family: 'Roboto',
                            style: 'normal',
                            lineHeight: 2
                        },
                        color: "#850c7a"
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false
                    },
                    ticks: {
                        display: false
                    },
                },
            }
        }
    })
}

getCategories()
getProducts()

// TODO: Поправить удаление графика при повторном запросе данных
