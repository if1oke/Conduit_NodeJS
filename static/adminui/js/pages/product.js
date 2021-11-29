$('.image-upload').on('mouseenter', () => {
    $('#productImageItem').hide()
    $('#productImageItemUpload').show()
}).on('mouseleave', () => {
    $('#productImageItem').show()
    $('#productImageItemUpload').hide()
})