const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql');
const Artist = require('./artist')(sequelize, DataTypes);

// Função para adicionar um novo artista
async function adicionarArtista() {
  try {
    // Crie um novo artista
    const novoArtista = await Artist.create({
      artist_name: 'Fábio',
      artist_birthdate: new Date('2004-02-11')
    });

    console.log('Novo artista criado:');
    console.log(novoArtista.toJSON());
  } catch (error) {
    console.error('Erro ao adicionar o novo artista:', error);
  }
}

// Chame a função para adicionar um novo artista
adicionarArtista();