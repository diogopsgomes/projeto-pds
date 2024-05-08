const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ticket', {
    tid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ticket_purchase_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ticket_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eventeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event',
        key: 'eid'
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
    ticket_statusts_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ticket_status',
        key: 'ts_id'
      }
    }
  }, {
    sequelize,
    tableName: 'ticket',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tid" },
        ]
      },
      {
        name: "FKticket844838",
        using: "BTREE",
        fields: [
          { name: "eventeid" },
        ]
      },
      {
        name: "FKticket358381",
        using: "BTREE",
        fields: [
          { name: "useruid" },
        ]
      },
      {
        name: "FKticket303505",
        using: "BTREE",
        fields: [
          { name: "ticket_statusts_id" },
        ]
      },
    ]
  });
};
