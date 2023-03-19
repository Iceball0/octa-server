const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Users = require('./users');

const Videos = sequelize.define('Videos', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,

        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    timestamps: false
});

// One to many
Users.hasMany(Videos, {
    foreignKey: 'userId'
});

Videos.belongsTo(Users, {
    foreignKey: 'userId'
});

module.exports = Videos;