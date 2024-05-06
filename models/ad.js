const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad', {
    adid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    piecepid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'piece',
        key: 'pid'
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ad',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "adid" },
        ]
      },
      {
        name: "FKad393708",
        using: "BTREE",
        fields: [
          { name: "useruid" },
        ]
      },
      {
        name: "FKad263245",
        using: "BTREE",
        fields: [
          { name: "piecepid" },
        ]
      },
    ]
  });
};
