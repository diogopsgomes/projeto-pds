const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql');

const UserStatus = sequelize.define('user_status', {
    us_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    us_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = UserStatus;