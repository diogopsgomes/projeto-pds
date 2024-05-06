const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification', {
    nid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    n_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    notification_typentid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'notification_type',
        key: 'ntid'
      }
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
    tableName: 'notification',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nid" },
        ]
      },
      {
        name: "FKnotificati112025",
        using: "BTREE",
        fields: [
          { name: "notification_typentid" },
        ]
      },
      {
        name: "FKnotificati836782",
        using: "BTREE",
        fields: [
          { name: "useruid" },
        ]
      },
    ]
  });
};
