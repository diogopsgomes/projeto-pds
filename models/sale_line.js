const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sale_line', {
    sale_lid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    line_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_invoicesale_invoiceid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sale_invoice',
        key: 'sale_invoiceid'
      }
    },
    productprodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'prodid'
      }
    }
  }, {
    sequelize,
    tableName: 'sale_line',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sale_lid" },
        ]
      },
      {
        name: "FKsale_line683962",
        using: "BTREE",
        fields: [
          { name: "sale_invoicesale_invoiceid" },
        ]
      },
      {
        name: "FKsale_line171151",
        using: "BTREE",
        fields: [
          { name: "productprodid" },
        ]
      },
    ]
  });
};
