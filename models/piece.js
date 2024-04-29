const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const Piece = sequelize.define('piece', {
    pid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    piece_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    artistaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Artist',
        key: 'aid'
      }
    },
    collectioncid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Collection',
        key: 'cid'
      }
    },
    piece_categorypcid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PieceCategory',
        key: 'pcid'
      }
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Museum',
        key: 'mid'
      }
    }
  });
  
  module.exports = Piece;