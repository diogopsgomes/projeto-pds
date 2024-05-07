const Sequelize = require('sequelize');
const initModels = require('../models/init-models');

const sequelize = new Sequelize('pds_musewww', 'root', 'diogodias11', {
  host: 'localhost',
  dialect: 'mysql'
});

const db = initModels(sequelize);

module.exports = db;