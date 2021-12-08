const loadItemInfo = () => {
    $('#fotorama').html()
    const itemId = $('#productId').val()
    return fetch(`/api/products/${itemId}`)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            const data = res.product
            $('#category').html(data.CategoryName)
            $('#description').html(data.description)
            $('#available').html(() => {
                if(data.available === true) return '<span class="text-success font-weight-bold">В наличии</span>'
                else return '<span class="text-danger font-weight-bold">Отсутствует</span>'
            })
            $('#weight').html(`${data.weight} гр`)
            $('#price').html(`${data.price} ₽`)
            let tagsHTML = ''
            data.Tags.forEach((item, idx, array) => {
                if (idx === array.length -1) tagsHTML += item.name
                else tagsHTML += `${item.name}, `
            })
            $('#tags').html(tagsHTML)
            $('#manufacturer').html(`<span class="font-weight-bold">${data.ManufacturerName}</span>`)
            $('#composition').html(`<span class="text-sm">${data.composition}</span>`)
            $('#productImageItem').attr('src', `/static/upload/${data.image}`)

            $('#createdAt').html(`${moment.utc(data.createdAt).format('DD.MM.YYYY')}`)
            $('#updatedAt').html(`${moment.utc(data.updatedAt).format('DD.MM.YYYY')}`)

            let galleryHTML = ''
            data.Images.forEach(image => {
                galleryHTML += `
                <a href="/static/upload/${image.name}">
                    <img alt="" src="/static/upload/${image.name}">
                </a>
                `
            })
            $('#fotorama').html(galleryHTML).fotorama()

            return data
        })
}

const removeSelectedImage = (item) => {
    $('#deleteButtonImg').html('<div class="spinner-border spinner-border-sm text-primary"></div>')
    let imageToRemove = $('.fotorama__active')[0]
    let selectedImage = imageToRemove.firstChild
    selectedImage = $(selectedImage).attr('src').split('/').slice(-1)[0]
    fetch('/api/products/image', {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Authorization': headerToken
        },
        body: JSON.stringify({
            image: selectedImage
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                document.location.reload()
            }
        })
}

const loadCategories = () => {
    // load categories
    return fetch('/api/categories')
        .then(res => res.json())
        .then(res => {
            res.categories.forEach(item => {
                $('#category').append(`<option value="${item}">${item}</option>`)
            })
            return res.categories
        })
}

const loadManufacturers = () => {
    // load manufacturers
    return fetch('/api/manufacturer/').then(res => res.json())
        .then(res => {
            res.manufacturers.forEach(item => {
                $('#existingManufacturer').append(`<option value="${item.name}">${item.name}</option>`)
            })
            return res.manufacturers
        })
}

const editShow = async () => {
    const productData = await loadItemInfo()
    const categoriesData = await loadCategories()
    const manufacturersData = await loadManufacturers()
    console.log(productData)
    console.log(categoriesData)
    console.log(manufacturersData)

    $('#nameEdit').val(productData.name)

    categoriesData.forEach(item => {
        console.log(item)
        if (productData.CategoryName === item) $('#categoryEdit').append(`<option value="${item}" selected>${item}</option>`)
        else $('#categoryEdit').append(`<option value="${item}">${item}</option>`)
    })

    manufacturersData.forEach(item => {
        if (productData.ManufacturerName === null) $('#existingManufacturer').prepend(`<option value="" selected>Выберите из списка</option>`)
        else if (productData.ManufacturerName === item) $('#existingManufacturer').prepend(`<option value="${item}" selected>${item}</option>`)
        else $('#existingManufacturer').append(`<option value="${item}">${item}</option>`)
    })

    $('#descriptionEdit').html(productData.description)

    tinyMCE.init({
        selector: '#descriptionEdit',
        language: 'ru'
    })

    if (productData.available === true) $('#availableEdit').prop('checked', true)

    let tagsValue = ''
    productData.Tags.forEach((item, idx, array) => {
        if (idx === array.length -1) tagsValue += item.name
        else tagsValue += `${item.name}, `
    })
    $('#tagsEdit').val(tagsValue)

    $('#weightEdit').val(productData.weight)
    $('#priceEdit').val(productData.price)
    $('#compositionEdit').val(productData.composition)

    $('.product-info').hide()
    $('.product-edit').show()

    // hide buttons
    $('#deleteProduct').hide()
    $('#productPage').hide()
    $('#editProduct').hide()
    $('#cancelEdit').show()
    $('#doEdit').show()

    $('#cancelEdit').on('click', () => {
        $('.product-info').show()
        $('.product-edit').hide()
        $('#deleteProduct').show()
        $('#productPage').show()
        $('#editProduct').show()
        $('#cancelEdit').hide()
        $('#doEdit').hide()
    })

    $('#doEdit').on('click', () => {
        submit(true)
    })
}

const submit = (update = false) => {
    const file = $('#image').prop('files')[0]
    if (file){
        let data = new FormData()
        data.append('image', file)
        fetch('/api/products/upload', {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(res => {
                if (res.fileName) {
                    if (!update) createProduct(res.fileName)
                    else updateProduct(res.fileName)
                } else {
                    toastr.error('Ошибка загрузки файла')
                    throw new Error('Ошибка загрузки файла')
                }
            })
    } else {
        if (!update) createProduct()
        else updateProduct()
    }
}

$('#editProduct').on('click', () => {
    editShow()
})

const updateProduct = (image = null) => {

    const id = $('#productId').val()
    const category = $('#categoryEdit').val();
    const name = $('#nameEdit').val();
    tinyMCE.triggerSave()
    const description = $('#descriptionEdit').val();
    const weight = $('#weightEdit').val();
    const price = $('#priceEdit').val();
    const newManufacturer = $('#newManufacturer').val();
    const existingManufacturer = $('#existingManufacturer').val()
    const composition = $('#compositionEdit').val()

    // Новый приоритетнее старого
    let manufacturer = null
    if(existingManufacturer.length > 1) {
        manufacturer = existingManufacturer
    }
    if(newManufacturer.length > 1) {
        manufacturer = newManufacturer
    }

    let tagList = null;
    if ($('#tagsEdit').val().length > 0) {
        tagList = $('#tagsEdit').val().split(',').map(tag => {
            return tag.trim()
        });
    }
    let available = 0
    if ($('#availableEdit').is(':checked')) {
        available = 1
    }

    if (!category || category === '') throw new Error('Укажите категорию')
    if (!name) throw new Error('Укажите название')
    if (!description) throw new Error('Укажите описание')
    if (!weight) throw new Error('Укажите вес')
    if (!price) throw new Error('Укажите стоимость')
    if (!manufacturer) throw new Error('Укажите произвоителя')
    if (!composition) throw new Error('Укажите состав')

    const message = {
        product: {
            category,
            name,
            description,
            weight,
            price,
            tagList,
            available,
            manufacturer,
            composition
        }
    }

    if (image) message.product.image = image

    console.log(message)

    $('#doEdit').html('<div class="spinner-border spinner-border-sm text-primary"></div>')

    fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Authorization': headerToken
        },
        body: JSON.stringify(message)
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if (res.updatedProduct) {
                toastr.success('Редактирование прошло успешно')
                $('#doEdit').html('Сохранить')
                $('#cancelEdit').trigger('click')
                loadItemInfo()
            } else {
                $('#doEdit').html('Сохранить')
                toastr.error(`Произошла ошибка:\n${res}`)
            }
        })
        .catch(e => {
            toastr.error(`Произошла ошибка:\n${e}`)
        })
}

const createProduct = (image = null) => {
    const category = $('#category').val();
    const name = $('#name').val();
    tinyMCE.triggerSave()
    const description = $('#description').val();
    const weight = $('#weight').val();
    const price = $('#price').val();
    const newManufacturer = $('#newManufacturer').val();
    const existingManufacturer = $('#existingManufacturer').val()
    const composition = $('#composition').val()

    // Новый приоритетнее старого
    let manufacturer = null
    if(existingManufacturer.length > 1) {
        manufacturer = existingManufacturer
    }
    if(newManufacturer.length > 1) {
        manufacturer = newManufacturer
    }

    let tagList = null;
    if ($('#tags').val().length > 0) {
        tagList = $('#tags').val().split(',').map(tag => {
            return tag.trim()
        });
    }
    let available = 0
    if ($('#available').is(':checked')) {
        available = 1
    }

    if (!category || category === '') throw new Error('Укажите категорию')
    if (!name) throw new Error('Укажите название')
    if (!description) throw new Error('Укажите описание')
    if (!weight) throw new Error('Укажите вес')
    if (!price) throw new Error('Укажите стоимость')
    if (!manufacturer) throw new Error('Укажите произвоителя')
    if (!composition) throw new Error('Укажите состав')

    const message = {
        product: {
            category,
            name,
            description,
            weight,
            price,
            tagList,
            available,
            manufacturer,
            composition,
            image: image
        }
    }

    fetch('/api/products/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': headerToken
        },
        body: JSON.stringify(message)
    })
        .then(res => res.json())
        .then(res => {
            if (res.product) {
                $('#alertSuccess').show()
                $('input').val('')
                toastr.success('Товар успешно создан!')
                setTimeout(() => {
                    document.location.href = `/admin/products/${res.product.id}`
                }, 1000)
            } else {
                toastr.error('Ошибка создания товара')
                throw new Error(res.errors.body)
            }
        })
        .catch(e => {
            toastr.error(e)
            console.log(e)
        })
}

const deleteProduct = () => {
    const remove = confirm('Удалить товар?')
    if (remove) {
        const id = $('#productId').val()
        fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': headerToken
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    toastr.success('Удаление прошло успешно')
                    setTimeout(()=> {
                        document.location.href = '/admin/products/'
                    }, 1000)
                } else {
                    throw new error('Ошибка')
                }
            })
            .catch(e => {
                toastr.error(`Ошибка:\n${e.message}`)
            })
    }
}

// FILE UPLOAD TEST
const inputElement = document.querySelector('#filepond')
const pond = FilePond.create(inputElement)
pond.setOptions({
    server: '/api/products/uploadMulti/'
})
pond.onprocessfile = (error, file) => {
    toastr.success('Файл загружен. Обновите страницу.')
}


$('#deleteProduct').on('click', () => {
    deleteProduct()
})

const initCreate = () => {
    loadCategories()
    loadManufacturers()
    $('#createProductSubmit').on('click', () => {
        submit()
    })
}

const initView = () => {
    loadItemInfo()
}
