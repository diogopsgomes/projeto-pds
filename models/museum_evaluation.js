const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('museum_evaluation', {
    me_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    me_evaluation: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
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
    tableName: 'museum_evaluation',
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
        name: "FKmuseum_eva930721",
        using: "BTREE",
        fields: [
          { name: "useruid" },
        ]
      },
    ]
  });
};
