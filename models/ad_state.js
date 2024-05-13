const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_state', {
    adstid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    adsadid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ad',
        key: 'adid'
      }
    }
  }, {
    sequelize,
    tableName: 'ad_state',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "adstid" },
        ]
      },
      {
        name: "FKad_state106895",
        using: "BTREE",
        fields: [
          { name: "adsadid" },
        ]
      },
    ]
  });
};
