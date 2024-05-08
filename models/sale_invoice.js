const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sale_invoice', {
    sale_invoiceid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    invoice_departure_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    tableName: 'sale_invoice',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sale_invoiceid" },
        ]
      },
      {
        name: "FKsale_invoi153001",
        using: "BTREE",
        fields: [
          { name: "useruid" },
        ]
      },
    ]
  });
};
