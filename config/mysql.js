const Sequelize = require('sequelize');

const connection = new Sequelize('pds_musewww', 'root', 'diogodias11', {
  host: 'localhost',
  dialect: 'mysql'
});

connection.authenticate()
  .then(() => {
    console.log('Conexão bem-sucedida com a base de dados.');
  })
  .catch(err => {
    console.error('Erro ao conectar com a base de dados:', err);
  });

module.exports = connection;