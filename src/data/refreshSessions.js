const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Users = require('./users');

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const ms = require('ms');

const RefreshSessions = sequelize.define("RefreshSessions", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fingerprint: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    expiresIn: {
        type: DataTypes.BIGINT,
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
Users.hasMany(RefreshSessions, {
    foreignKey: 'userId'
});

RefreshSessions.belongsTo(Users, {
    foreignKey: 'userId'
});

// generate Access and Refresh tokens
RefreshSessions.generateToken = async (user, fingerprint, userAgent) => {

    const payload = {user_id: user.id};

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

    // remove first session if too many
    user_tokens = await RefreshSessions.findAll({ where: { userId: user.id } });
    if (user_tokens.length >= 5) {
        await user_tokens[0].destroy();
    }

    const refSess = await RefreshSessions.create({
        userId: user.id,
        refreshToken: uuidv4(),
        userAgent: userAgent,
        fingerprint: fingerprint,
        expiresIn: ms('30d') / 1000
    });

    const refreshToken = refSess.refreshToken;
    const expiresIn = refSess.expiresIn;
    return { accessToken, refreshToken, expiresIn };
}

// check if Refresh token is expired
RefreshSessions.verifyExpiration = (token) => {
    return new Date(token.createdAt + token.expiresIn * 1000) < Date.now();
}

// check if Refresh token fingerprint is the same
RefreshSessions.verifyFingerprint = (token, fingerprint) => {
    console.log(token.fingerprint, fingerprint);
    return token.fingerprint === fingerprint;
}

module.exports = RefreshSessions;