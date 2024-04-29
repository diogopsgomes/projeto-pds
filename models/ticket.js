const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const Ticket = sequelize.define('ticket', {
    tid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
        model: 'Event',
        key: 'eid'
      }
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'uid'
      }
    },
    ticket_statusts_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TicketStatus',
        key: 'ts_id'
      }
    }
  });
  
  module.exports = Ticket;