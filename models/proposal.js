const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proposal', {
    proposalid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    adadid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ad',
        key: 'adid'
      }
    },
    usermuseummuseummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usermuseum',
        key: 'museummid'
      }
    },
    usermuseumuseruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usermuseum',
        key: 'useruid'
      }
    }
  }, {
    sequelize,
    tableName: 'proposal',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "proposalid" },
        ]
      },
      {
        name: "FKproposal520078",
        using: "BTREE",
        fields: [
          { name: "adadid" },
        ]
      },
      {
        name: "FKproposal542150",
        using: "BTREE",
        fields: [
          { name: "usermuseummuseummid" },
          { name: "usermuseumuseruid" },
        ]
      },
    ]
  });
};
