const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const MuseumCategory = sequelize.define('museum_category', {
    mcid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mc_description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = MuseumCategory;