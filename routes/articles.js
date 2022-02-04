const express = require('express')
const router = express.Router()

const {authByToken} = require('../middleware/auth')

const ArticleController = require('../controllers/articles')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/upload/articles')
    },
    filename: function (req, file, cb) {
        cb(null, (Date.now() + '_' + file.originalname).replace(' ', ''))
    }
})
const upload = multer({storage: storage})

router.get('/',ArticleController.getAllArticles)                    //Get most recent articles from users you follow
router.get('/feed',authByToken,ArticleController.getFeed)           //Get most recent articles globally
router.post('/',authByToken,ArticleController.createArticle)        //Create an article
router.get('/:slug',ArticleController.getSingleArticleBySlug)       //Get an article
router.patch('/:slug',authByToken,ArticleController.updateArticle)  //Update an article
router.delete('/:slug',authByToken,ArticleController.deleteArticle) //Delete an article
router.post('/upload',upload.array('file'),ArticleController.upload)         //Upload image

module.exports = router
