const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    uid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_statusus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_status',
        key: 'us_id'
      }
    },
    user_typeutid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_type',
        key: 'utid'
      }
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uid" },
        ]
      },
      {
        name: "FKuser33915",
        using: "BTREE",
        fields: [
          { name: "user_typeutid" },
        ]
      },
      {
        name: "FKuser470631",
        using: "BTREE",
        fields: [
          { name: "user_statusus_id" },
        ]
      },
    ]
  });
};
