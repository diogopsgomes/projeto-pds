const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('event', {
    eid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    event_start_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_end_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_typeetid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event_type',
        key: 'etid'
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
    event_statuses_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event_status',
        key: 'es_id'
      }
    }
  }, {
    sequelize,
    tableName: 'event',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "eid" },
        ]
      },
      {
        name: "FKevent956024",
        using: "BTREE",
        fields: [
          { name: "event_typeetid" },
        ]
      },
      {
        name: "FKevent814262",
        using: "BTREE",
        fields: [
          { name: "museummid" },
        ]
      },
      {
        name: "FKevent369126",
        using: "BTREE",
        fields: [
          { name: "event_statuses_id" },
        ]
      },
    ]
  });
};
