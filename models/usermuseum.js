const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usermuseum', {
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'museum',
        key: 'mid'
      }
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    tableName: 'usermuseum',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "museummid" },
          { name: "useruid" },
        ]
      },
      {
        name: "FKusermuseum930007",
        using: "BTREE",
        fields: [
          { name: "useruid" },
        ]
      },
    ]
  });
};
