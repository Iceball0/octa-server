const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Users = require('./users');

const Subscribes = sequelize.define('Subscribes', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    channelId : {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false
});


// Many to many
Users.belongsToMany(Users, {
    through: 'Subscribes',
    foreignKey: 'channelId',
    otherKey: 'userId',
    as: 'userSubscribes',
});

module.exports = Subscribes;