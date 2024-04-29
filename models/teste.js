const Artist = require('./artist');

async function criarNovoArtista() {
  try {
    const novoArtista = await Artist.create({
      artist_name: 'João',
      artist_birthdate: new Date('2004-02-11')
    });

    console.log('Novo artista criado:');
    console.log(novoArtista.toJSON());
  } catch (error) {
    console.error('Erro ao criar o novo artista:', error);
  }
}

criarNovoArtista();