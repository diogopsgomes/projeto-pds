const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchase_line', {
    purchase_lid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    purline_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    productprodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'prodid'
      }
    },
    purchase_invoicepurchase_invoiceid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'purchase_invoice',
        key: 'purchase_invoiceid'
      }
    }
  }, {
    sequelize,
    tableName: 'purchase_line',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "purchase_lid" },
        ]
      },
      {
        name: "FKpurchase_l690993",
        using: "BTREE",
        fields: [
          { name: "productprodid" },
        ]
      },
      {
        name: "FKpurchase_l442533",
        using: "BTREE",
        fields: [
          { name: "purchase_invoicepurchase_invoiceid" },
        ]
      },
    ]
  });
};
