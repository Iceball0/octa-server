const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Users = sequelize.define('Users', {
    login: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hashed_password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false
});

module.exports = Users;