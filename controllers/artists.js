const Artist = require("../models/artist");
const utils = require("../utils/index");

exports.getArtists = async (req, res) => {
	try {
		let artists = await Artist.findAll();

		if (artists.length === 0)
			return res.status(404).send({ success: 0, message: "Não existem artistas" });

		let response = {
			success: 1,
			length: artists.length,
			results: artists.map((artist) => {
				return {
					id: artist.id,
                    name: artist.name,
                    birthday: artist.birthday,
				};
			}),
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getArtist = async (req, res) => {
	try {
		let id = req.params.id;

		let artist = await Artist.findByPk(id);

		if (!artist) {
			return res.status(404).send({ success: 0, message: "Artista inexistente" });
		}

		let response = {
			success: 1,
			length: 1,
			results: [
				{
					id: artist.id,
                    name: artist.name,
                    birthday: artist.birthday,
				},
			],
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error fetching artist:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addArtist = async (req, res) => {
	try {

		let name = req.body.name;
		let birthday = req.body.birthday;
		let idOwner = req.body.idOwner;
		let idUserToken = req.user.id;

		let isAdmin = await utils.isAdmin(idUserToken); //Verificar
		if (!isAdmin && idOwner != idUserToken) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let user = await User.findByPk(idOwner);
		if (!user) {
			return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
		}

		let newArtist = await Artist.create({
			name: name,
			birthday: birthday,
			id_user: idOwner
		});

		let response = {
			success: 1,
			message: "Artista criado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error adding museum:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editArtist = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let artist = await Artist.findByPk(id);

		if (!artist) {
			return res.status(404).send({ success: 0, message: "Artista inexistente" });
		}

		let idOwner = artist.id_user;

		let isAdmin = await utils.isAdmin(idUserToken); //Verificar
		if (!isAdmin && idOwner != idUserToken) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let { name, birthday } = req.body;

		if (name) artist.name = name;
		if (birthday) artist.birthday = birthday; //Colocar verificações

		await artist.save();

		let response = {
			success: 1,
			message: "Artista editado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error editing artist:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeArtist = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let artist = await Artist.findByPk(id);

		if (!artist) {
			return res.status(404).send({ success: 0, message: "Artista inexistente" });
		}

		let idOwner = artist.id_user;

		let isAdmin = await utils.isAdmin(idUserToken); //Verificar
		if (!isAdmin && idOwner != idUserToken) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		await artist.destroy();

		let response = {
			success: 1,
			message: "Artista removido com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error removing artist:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};