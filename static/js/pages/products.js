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
                    submitProduct(res.fileName)
                } else {
                    throw new Error('Ошибка загрузки файла')
                }
            })
    } else {
        submitProduct()
    }
}

const submitProduct = (image = null) => {
    const category = $('#category').val();
    const name = $('#name').val();
    const description = $('#description').val();
    const weight = $('#weight').val();
    const price = $('#price').val();
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

    const message = {
        product: {
            category,
            name,
            description,
            weight,
            price,
            tagList,
            available,
            image: image
        }
    }

    console.log(message)

    if (headerToken) {
        fetch('/api/products/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `${headerToken}`
            },
            body: JSON.stringify(message)
        })
            .then(res => res.json())
            .then(res => {
                if (res.product) {
                    $('#alertSuccess').show()
                    $('input').val('')
                    setTimeout(() => {
                        $('#productCreateShow').click()
                    }, 1500)
                    loadProducts()
                } else {
                    throw new Error(res.errors.body)
                }
            })
            .catch(e => console.log(e))
    }
}

const loadProducts = () => {
    if ($.fn.dataTable.isDataTable('#productListTable')) {
        $('#productListTable').DataTable().destroy()
    }
    fetch('/api/products')
        .then(res => res.json())
        .then(res => {
            console.log(res)
            $('#productListTable').DataTable({
                data: res.products,
                columns: [
                    {data: 'id'},
                    {data: 'category'},
                    {data: 'name'},
                    {data: 'description'},
                    {data: 'weight'},
                    {data: 'price'},
                    {data: 'tagList'},
                    {data: 'available'}
                ]
            })
        })
}

$('#productCreateSubmit').click(() => {
    submit()
})

loadProducts()