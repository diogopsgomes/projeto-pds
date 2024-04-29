const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const UserType = sequelize.define('user_type', {
    utid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ut_description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = UserType;