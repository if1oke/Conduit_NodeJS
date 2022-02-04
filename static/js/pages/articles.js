$('#save-article').on('click', () => {
    console.log(prepareArticle())
})

const prepareArticle = () => {
    const title = $('#article-title').val()
    if (!title) {
        toastr.error('Укажите заголовок')
        throw new Error('Укажите заголовок')
    }
    const description = tinyMCE.get('description').getContent()
    if (!description) {
        toastr.error('Укажите описание')
        throw new Error('Укажите описание')
    }
    let body = tinyMCE.get('body').getContent()
    if (!body) body = description

    const tags = $('#article-tags').val().replace(' ', '').split(',')

    return {
        title,
        description,
        body,
        tagList: tags
    }
}
