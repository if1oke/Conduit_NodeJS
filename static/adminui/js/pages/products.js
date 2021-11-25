const getCategories = () => {
    $('#categoryList').html('<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>')
    fetch('/api/category')
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
        fetch('/api/category/' + catName, {
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
            })
    }
}

const saveClick = (item) => {
    const oldCatName = (item.id).replace('_save', '')
    const newCatName = $(`#${oldCatName}_inputText`).val()
    fetch('/api/category/' + oldCatName, {
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
        })
}

const addCategory = () => {
    const newCategory = $('#categoryAddInput').val()
    if (newCategory.length > 1) {
        $('#categoryAdd').hide()
        fetch('/api/category/', {
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
            })
    } else {
        toastr.error('Слишком короткое имя')
    }
}

const showCategoryAdd = () => {
    $('#categoryAdd').toggle('fast')
}

getCategories()
