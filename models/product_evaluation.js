const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_evaluation', {
    pe_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pe_evaluation: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    productprodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product',
        key: 'prodid'
      }
    }
  }, {
    sequelize,
    tableName: 'product_evaluation',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "useruid" },
          { name: "productprodid" },
        ]
      },
      {
        name: "FKproduct_ev131506",
        using: "BTREE",
        fields: [
          { name: "productprodid" },
        ]
      },
    ]
  });
};
