const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('support_ticket', {
    stid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    support_statesssid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'support_state',
        key: 'ssid'
      }
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'museum',
        key: 'mid'
      }
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    admin_useruid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    tableName: 'support_ticket',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "stid" },
        ]
      },
      {
        name: "FKsupport_ti689656",
        using: "BTREE",
        fields: [
          { name: "support_statesssid" },
        ]
      },
      {
        name: "FKsupport_ti993949",
        using: "BTREE",
        fields: [
          { name: "museummid" },
        ]
      },
      {
        name: "FKsupport_ti303040",
        using: "BTREE",
        fields: [
          { name: "useruid" },
        ]
      },
      {
        name: "FKsupport_ti140257",
        using: "BTREE",
        fields: [
          { name: "admin_useruid" },
        ]
      },
    ]
  });
};
