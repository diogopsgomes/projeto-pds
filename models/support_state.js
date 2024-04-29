const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const SupportState = sequelize.define('support_state', {
    ssid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = SupportState;