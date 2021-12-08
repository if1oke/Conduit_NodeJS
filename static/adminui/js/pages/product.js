const loadItemInfo = () => {
    const itemId = $('#productId').val()
    fetch(`/api/products/${itemId}`)
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
            $('#manufacturer').html(`<span class="font-weight-bold">${data.ManufacturerName}</span>`)
            $('#composition').html(`<span class="text-sm">${data.composition}</span>`)
        })
}

const createProductLoadParameters = () => {
    // load categories
    fetch('/api/categories')
        .then(res => res.json())
        .then(res => {
            res.categories.forEach(item => {
                $('#category').append(`<option value="${item}">${item}</option>`)
            })
        })
    fetch('/api/manufacturer/').then(res => res.json())
        .then(res => {
            res.manufacturers.forEach(item => {
                $('#existingManufacturer').append(`<option value="${item.name}">${item.name}</option>`)
            })
        })

}

const submit = () => {
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
                    createProduct(res.fileName)
                } else {
                    toastr.error('Ошибка загрузки файла')
                    throw new Error('Ошибка загрузки файла')
                }
            })
    } else {
        createProduct()
    }
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

const initCreate = () => {
    createProductLoadParameters()
    $('#createProductSubmit').on('click', () => {
        submit()
    })
}

const initView = () => {
    loadItemInfo()
}
