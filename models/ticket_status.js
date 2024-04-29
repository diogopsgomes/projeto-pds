const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const TicketStatus = sequelize.define('ticket_status', {
    ts_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    desc_ticket_status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = TicketStatus;