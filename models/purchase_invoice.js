const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchase_invoice', {
    purchase_invoiceid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    purchase_entry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'museum',
        key: 'mid'
      }
    }
  }, {
    sequelize,
    tableName: 'purchase_invoice',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "purchase_invoiceid" },
        ]
      },
      {
        name: "purchase_invoiceid",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "purchase_invoiceid" },
        ]
      },
      {
        name: "FKpurchase_i720943",
        using: "BTREE",
        fields: [
          { name: "museummid" },
        ]
      },
    ]
  });
};
