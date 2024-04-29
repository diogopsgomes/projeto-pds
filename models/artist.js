const DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const Artist = sequelize.define('artist', {
  aid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  artist_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artist_birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Artist;

