const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const ZipCode = sequelize.define('zip_code', {
    zipid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = ZipCode;