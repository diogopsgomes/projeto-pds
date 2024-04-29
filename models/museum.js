const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql');

const Museum = sequelize.define('museum', {
    mid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    museum_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    museum_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    premium: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false
    },
    zip_ext: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    museum_categorymcid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'MuseumCategory',
        key: 'mcid'
      }
    },
    zip_codezipid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ZipCode',
        key: 'zipid'
      }
    }
  });
  
  module.exports = Museum;