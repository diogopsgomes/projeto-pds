const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('piece', {
    pid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    piece_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    artistaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artist',
        key: 'aid'
      }
    },
    collectioncid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'collection',
        key: 'cid'
      }
    },
    piece_categorypcid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'piece_category',
        key: 'pcid'
      }
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'museum',
        key: 'mid'
      }
    }
  }, {
    sequelize,
    tableName: 'piece',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pid" },
        ]
      },
      {
        name: "FKpiece817937",
        using: "BTREE",
        fields: [
          { name: "artistaid" },
        ]
      },
      {
        name: "FKpiece179481",
        using: "BTREE",
        fields: [
          { name: "collectioncid" },
        ]
      },
      {
        name: "FKpiece299908",
        using: "BTREE",
        fields: [
          { name: "piece_categorypcid" },
        ]
      },
      {
        name: "FKpiece43161",
        using: "BTREE",
        fields: [
          { name: "museummid" },
        ]
      },
    ]
  });
};
