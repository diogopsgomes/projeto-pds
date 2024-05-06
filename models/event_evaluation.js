const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('event_evaluation', {
    ee_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ee_evaluation: {
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
    eventeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'event',
        key: 'eid'
      }
    }
  }, {
    sequelize,
    tableName: 'event_evaluation',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "useruid" },
          { name: "eventeid" },
        ]
      },
      {
        name: "FKevent_eval415646",
        using: "BTREE",
        fields: [
          { name: "eventeid" },
        ]
      },
    ]
  });
};
