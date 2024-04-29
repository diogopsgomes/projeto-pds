const Museum = require('../models/museum');
const User = require('../models/user');
const utils = require('../utils/index');

exports.getMuseums = async (req, res) => {
	try {
		let museums = await Museum.findAll();

		if (museums.length === 0) return res.status(404).send({ success: 0, message: "Não existem museus" });

		let response = {
			success: 1,
			length: museums.length,
			results: museums.map((museum) => {
				return {
					id: museum.id_museum,
					name: museum.name,
					type: museum.type,
					nif: museum.nif,
					address: museum.address,
					postalCode: museum.postal_code,
					city: museum.city,
					img: museum.img,
					bg: museum.bg,
					approved: museum.approved,
					idOwner: museum.id_user,
				};
			}),
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getMuseum = async (req, res) => {
	try {
		let id = req.params.id;

		let museum = await Museum.findByPk(id);

		if (!museum) {
			return res.status(404).send({ success: 0, message: "Museu inexistente" });
		}

		let response = {
			success: 1,
			length: 1,
			results: [{
				id: museum.id_museum,
				name: museum.name,
				type: museum.type,
				nif: museum.nif,
				address: museum.address,
				postalCode: museum.postal_code,
				city: museum.city,
				img: museum.img,
				bg: museum.bg,
				approved: museum.approved,
				idOwner: museum.id_user,
			}],
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error fetching museum:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addMuseum = async (req, res) => {
	try {

		let name = req.body.name;
		let type = req.body.type;
		let address = req.body.address;
		let postalCode = req.body.postalCode;
		let city = req.body.city;
		let nif = req.body.nif;
		let idOwner = req.body.idOwner;
		let idUserToken = req.user.id;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin && idOwner != idUserToken) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let user = await User.findByPk(idOwner);
		if (!user) {
			return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
		}

		let newMuseum = await Museum.create({
			name: name,
			type: type,
			address: address,
			postal_code: postalCode,
			city: city,
			nif: nif,
			id_user: idOwner
		});

		let response = {
			success: 1,
			message: "Museu criado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error adding museum:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editMuseum = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let museum = await Museum.findByPk(id);

		if (!museum) {
			return res.status(404).send({ success: 0, message: "Museu inexistente" });
		}

		let idOwner = museum.id_user;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin && idOwner != idUserToken) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let { address, postalCode, city, nif } = req.body;

		if (address) museum.address = address;
		if (postalCode) museum.postal_code = postalCode;
		if (city) museum.city = city;
		if (nif) {
			if (!Number.isInteger(nif) || nif.length != 9) {
				return res.status(406).send({ success: 0, message: "NIF inválido" });
			}
			museum.nif = nif;
		}

		await museum.save();

		let response = {
			success: 1,
			message: "Museu editado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error editing museum:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeMuseum = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let museum = await Museum.findByPk(id);

		if (!museum) {
			return res.status(404).send({ success: 0, message: "Museu inexistente" });
		}

		let idOwner = museum.id_user;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin && idOwner != idUserToken) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		await museum.destroy();

		let response = {
			success: 1,
			message: "Museu removido com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error removing museum:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.approveMuseum = async (req, res) => {
	try {

		const id = req.params.id;
		const idUserToken = req.user.id;

		const isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		const museum = await Museum.findByPk(id);

		if (!museum) {
			return res.status(404).send({ success: 0, message: "Museu inexistente" });
		}

		if (museum.approved === 1) {
			return res.status(409).send({ success: 0, message: "Museu já aprovado" });
		}

		museum.approved = 1;
		await museum.save();

		const response = {
			success: 1,
			message: "Museu aprovado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error approving museum:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};


