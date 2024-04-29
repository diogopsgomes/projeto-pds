const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const SupportTicket = sequelize.define('support_ticket', {
    stid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    support_statessid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'support_status',
        key: 'ssid'
      }
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Museum',
        key: 'mid'
      }
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'uid'
      }
    }
  });

  module.exports = SupportTicket;