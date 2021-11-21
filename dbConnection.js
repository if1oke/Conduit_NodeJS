const {Sequelize} = require('sequelize')

//LOCAL CONNECTION
const sequelize = new Sequelize('base','store','Wex755!a',{
    dialect: 'mysql',
    host:'127.0.0.1',
    logging: false
});


//AMAZON RDS CONNECTION
/* const sequelize = new Sequelize('conduit1',process.env.USER_NAME,process.env.PASSWORD,{
    dialect: 'mysql',
    host:process.env.DB_HOST,
    logging: false,
    port: 3306
});
 */
// const sequelize = new Sequelize('d6rk5ijgmvcf6q',process.env.USER_NAME,process.env.PASSWORD,{
//     dialect: 'postgres',
//     host: process.env.DB_HOST,
//     logging: false,
//     port: 5432,
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false // <<<<<<< YOU NEED THIS
//         }
//     }
// });

const checkConnection =async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

checkConnection()

module.exports = sequelize