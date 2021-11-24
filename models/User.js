const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const User = sequelize.define('User',{
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},{
    timestamps: false,
    indexes: [
        { fields: ['username'], unique: true}
    ]
})


module.exports = User

/* {
  "user": {
    "token": "jwt.token.here",
  }
} */
