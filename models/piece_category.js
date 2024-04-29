const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const PieceCategory = sequelize.define('piece_category', {
    pcid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pc_description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = PieceCategory;