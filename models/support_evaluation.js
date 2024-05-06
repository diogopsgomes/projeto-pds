const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('support_evaluation', {
    se_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    se_evaluation: {
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
    support_ticketstid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'support_ticket',
        key: 'stid'
      }
    }
  }, {
    sequelize,
    tableName: 'support_evaluation',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "useruid" },
          { name: "support_ticketstid" },
        ]
      },
      {
        name: "FKsupport_ev202562",
        using: "BTREE",
        fields: [
          { name: "support_ticketstid" },
        ]
      },
    ]
  });
};
