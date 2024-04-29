const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const Product = sequelize.define('Product', {
    prodid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    product_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Museum',
        key: 'mid'
      }
    },
    product_typeptid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ProductType',
        key: 'ptid'
      }
    }
  });

  module.exports = Product;