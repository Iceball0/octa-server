const Sequelize = require('sequelize');

// Database
const sequelize = new Sequelize("hackathon-dstu3", "root", "", {
    dialect: "mysql",
    host: "localhost",
    logging: false
});


module.exports = sequelize;