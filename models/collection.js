const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const Collection = sequelize.define('collection', {
    cid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    collection_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = Collection;