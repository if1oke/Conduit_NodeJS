const dotenv = require('dotenv').config()
const express = require('express')
const hbs = require('hbs')
const morgan = require('morgan')
const cors = require('cors')

const {notFound,errorHandler} = require('./middleware/errorHandler')
const sequelize = require('./dbConnection')

const User = require('./models/User')
const Article = require('./models/Article')
const Tag = require('./models/Tag')
const Comment = require('./models/Comments')
const Product = require('./models/Products')
const Cart = require('./models/Cart')
const Category = require('./models/Categories')
const Manufacture = require('./models/Manufacturer')

const userRoute = require('./routes/users')
const articleRoute = require('./routes/articles')
const commentRoute = require('./routes/comments')
const tagRoute = require('./routes/tags')
const profileRoute = require('./routes/profile')
const favouriteRoute = require('./routes/favourites')
const productRoute = require('./routes/products')
const cartRoute = require('./routes/cart')
const categoryRoute = require('./routes/categories')
const manufactureRoute = require('./routes/manufacturers')

const frontendAdminRoute = require('./routes/frAdmin')
const frontendUserRoute = require('./routes/frUser')

const fileUpload = require('express-fileupload');

const app = express()

//CORS
app.use(cors({credentials: true, origin: true}))

app.use(fileUpload({
    createParentPath: true
}))

app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials')



//RELATIONS:
//1 to many relation between user and article
User.hasMany(Article,{
    onDelete: 'CASCADE'
})
Article.belongsTo(User)

//many to many relation between product and taglist
Product.belongsToMany(Tag, {through: 'ProductsTags', uniqueKey: false, timestamps: false})
Tag.belongsToMany(Product, {through: 'ProductsTags',uniqueKey:false,timestamps:false})

//One to many relation between Article and Comments
Product.hasMany(Comment,{onDelete: 'CASCADE'})
Comment.belongsTo(Product)

//Products and Categories
Category.hasMany(Product)
Product.belongsTo(Category)

// Products and Manufacturer
Manufacture.hasMany(Product)
Product.belongsTo(Manufacture)

//One to many relation between User and Comments
User.hasMany(Comment,{onDelete: 'CASCADE'})
Comment.belongsTo(User)

//Many to many relation between User and User
User.belongsToMany(User,{
    through:'Followers',
    as:'followers',
    timestamps:false,
})

//favourite Many to many relation between User and article
User.belongsToMany(Article,{through: 'Favourites',timestamps:false})
Article.belongsToMany(User,{through: 'Favourites',timestamps:false})



const sync = async () => await sequelize.sync({alter:true})
sync()


app.use(express.json())
app.use(morgan('tiny'))

app.get('/',(req,res) => {
    res.json({status:"API is running"});
})
// FRONTEND
app.use('/static', express.static('static'))
// app.use('/registration', (request, response) => {
//     response.sendFile(__dirname + '/static/registration.html')
// })
// app.use('/product', (request, response) => {
//     response.sendFile(__dirname + '/static/products.html')
// })
// app.use('/login', (request, response) => {
//     response.sendFile(__dirname + '/static/login.html')
// })
app.use('/admin', frontendAdminRoute)
// app.use('/', frontendUserRoute)

// BACKEND
app.use('/api',userRoute)
app.use('/api/articles',articleRoute)
app.use('/api/products',commentRoute)
app.use('/api/tags',tagRoute)
app.use('/api/profiles',profileRoute)
app.use('/api/articles',favouriteRoute)
app.use('/api/products', productRoute)
app.use('/api/cart', cartRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/manufacturer/', manufactureRoute)
app.use(notFound)
app.use(errorHandler)



const PORT = process.env.PORT || 8080

app.listen(PORT,() => {
    console.log(`Server running on http://localhost:8080`);
})
