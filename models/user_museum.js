const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const UserMuseum = sequelize.define('user_museum', {
    museummid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Museum',
        key: 'mid'
      }
    },
    useruid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'uid'
      }
    },
    user_typeutid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'UserType',
        key: 'utid'
      }
    }
  });
  
  module.exports = UserMuseum;