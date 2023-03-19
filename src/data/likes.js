const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Users = require('./users');
const Videos = require('./videos');

const Likes = sequelize.define('Likes', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    videoId : {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false
});

// Many to many
Users.belongsToMany(Videos, {
    through: 'Likes',
    foreignKey: 'userId'
});

Videos.belongsToMany(Users, {
    through: 'Likes',
    foreignKey: 'videoId'
});

module.exports = Likes;