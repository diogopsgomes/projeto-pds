const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    prodid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING(255),
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
        model: 'museum',
        key: 'mid'
      }
    },
    product_typeptid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product_type',
        key: 'ptid'
      }
    }
  }, {
    sequelize,
    tableName: 'product',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "prodid" },
        ]
      },
      {
        name: "FKproduct180280",
        using: "BTREE",
        fields: [
          { name: "museummid" },
        ]
      },
      {
        name: "FKproduct885527",
        using: "BTREE",
        fields: [
          { name: "product_typeptid" },
        ]
      },
    ]
  });
};
